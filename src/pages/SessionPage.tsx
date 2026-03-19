import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useGetSessionsByDateQuery } from "../services/sessionsApi";
import DateTabs from "../components/SessionsDisplay/DateTabs";
import SessionDetails from "../components/SessionsDisplay/SessionDetails";
import { StatusEnum } from "../utils/EnumsFile";
import { NavLink, useParams, useSearchParams } from "react-router-dom";
import Loader from "../components/Loader";
import { FaHome } from "react-icons/fa";
import { fetchMovie } from "../store/movieSlice";

const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const SessionPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { movieId } = useParams<{ movieId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const { movie, status: movieStatus } = useSelector(
    (state: RootState) => state.movie
  );

  const selectedDate =
    searchParams.get("date") ?? formatDateToYYYYMMDD(new Date());

  const handleDateSelect = useCallback(
    (date: string) => setSearchParams({ date }, { replace: true }),
    [setSearchParams]
  );

  useEffect(() => {
    if (movieId) dispatch(fetchMovie(+movieId));
  }, [movieId, dispatch]);

  const { data: sessions = [], isLoading: sessionsLoading } =
    useGetSessionsByDateQuery(
      movieId ? { movieId, date: selectedDate } : skipToken
    );

  const posterBaseUrl = "https://image.tmdb.org/t/p/original";
  const allMovieSessions = movie?.sessions ?? [];

  return (
    <div className="mt-28 p-4 text-white max-w-[1200px] m-auto min-h-[calc(100vh-130px)] flex flex-col">
      <div className="flex items-center mb-6 pl-4">
        <NavLink
          to="/"
          className="mr-4 text-white transition duration-200 w-12 h-12 backdrop-blur-sm rounded-full bg-white/20 flex items-center justify-center hover:bg-gray-100/40 hover:border-1 hover:border-yellow-500"
        >
          <FaHome />
        </NavLink>
        <h1 className="text-xl font-semibold">Available sessions</h1>
      </div>

      <div className="flex p-4 justify-between items-end">
        <div className="flex max-h-42">
          <img
            src={
              movie?.poster_path
                ? `${posterBaseUrl}${movie.poster_path}`
                : "https://via.placeholder.com/40x60.png?text=N/A"
            }
            alt={movie?.title}
            className="w-28 h-42 object-cover rounded-sm mr-4 flex-shrink-0 bg-gray-700"
          />
          <div className="flex flex-col overflow-hidden text-wrap max-w-[680px] justify-end text-ellipsis">
            <h3 className="text-white text-5xl font-medium truncate leading-tight">
              {movie?.title}
            </h3>
            <p className="text-white text-md">
              {movie?.overview.split(/[.!?]/)[0]}
            </p>
          </div>
        </div>

        {movie && (
          <div className="w-[320px]">
            <div className="flex flex-wrap gap-4 text-md opacity-80 justify-end">
              <span>{movie.vote_average.toFixed(1)} IMDB</span>•
              <span>{movie.release_date?.split("-")[0]}</span>•
              <span>{movie.genres[0]?.name}</span>•
            </div>
            <div className="flex flex-wrap gap-4 text-md opacity-80 justify-end">
              <span>{movie.runtime} min.</span>•<span>2D</span>•
              <span>Cinetech+</span>
            </div>
          </div>
        )}
      </div>

      <hr className="m-4" />

      <div className="p-4 text-white">
        <h2 className="text-2xl font-semibold mb-4">Choose a session</h2>

        <DateTabs
          onDateSelect={handleDateSelect}
          allSessions={allMovieSessions}
          currentSelectedDate={selectedDate}
        />

        {(sessionsLoading || movieStatus === StatusEnum.LOADING) && <Loader />}

        {sessions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {sessions.map((session) => (
              <SessionDetails key={session.session._id} session={session} />
            ))}
          </div>
        )}

        {!sessionsLoading && selectedDate && sessions.length === 0 && (
          <p className="text-gray-400 text-center py-10">
            There are no sessions on the selected date.
          </p>
        )}
      </div>
    </div>
  );
};

export default SessionPage;