import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { ActorsSection } from "../components/MovieComponents/ActorsSection";
import { BackdropSection } from "../components/MovieComponents/BackdropSection";
import { MovieDetailsSection } from "../components/MovieComponents/MovieDetailsSection";
import { TrailerSection } from "../components/MovieComponents/TrailerSection";
import { fetchMovie } from "../store/movieSlice";
import { AppDispatch, RootState } from "../store/store";
import Loader from "../components/Loader";
import { IoTicket } from "react-icons/io5";
import { RoutePaths, StatusEnum } from "../utils/EnumsFile";
import { FaHeart, FaHome } from "react-icons/fa";
import { addFavorite } from "../store/favoritesSlice";
import OtherMovies from "../components/MovieComponents/OtherMovies";

const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const MoviePage: React.FC = () => {
  const { movieId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { movie, status } = useSelector((state: RootState) => state.movie);
  useEffect(() => {
    if (movieId) dispatch(fetchMovie(+movieId));
  }, [movieId, dispatch]);

  if (status === StatusEnum.LOADING || !movie)
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <Loader />
      </div>
    );

  const handleAddToFavorite = () => {
    if (movieId) dispatch(addFavorite(+movieId));
  };

  const today = new Date();
  const futureSessions = movie?.sessions
    .filter((session) => new Date(session.dateTime) >= today)
    .sort(
      (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
    );
  const session = new Date(futureSessions[0]?.dateTime);
  const dateSession = formatDateToYYYYMMDD(session);
  const sessionsPath = RoutePaths.MOVIESESSIONS.replace(
    ":movieId",
    movieId ?? ""
  );
  const linkToSessions = sessionsPath
    ? `${sessionsPath}?date=${dateSession}`
    : sessionsPath;

  return (
    <div className="relative h-full flex flex-col gap-6 mb-32">
      <BackdropSection
        backdrop_path={movie.backdrop_path}
        title={movie.title}
        overview={movie.tagline}
        imdb={movie.vote_average}
        year={movie.release_date?.split("-")[0] || ""}
        genre={movie.genres?.[0]?.name || ""}
        duration={movie.runtime}
      />
      <div className="absolute z-10 top-26 flex items-center mb-6 left-8">
        <NavLink
          to={"/"}
          className="mr-4 text-white transition duration-200 w-12 h-12 backdrop-blur-sm rounded-full bg-white/20 flex items-center justify-center hover:bg-gray-100/40 hover:border-1 hover:border-yellow-500"
        >
          <FaHome />
        </NavLink>
        <h1 className="text-xl font-semibold">{movie.title}</h1>
      </div>
      <MovieDetailsSection
        genres={movie.genres}
        origin_country={movie.origin_country}
        overview={movie.overview}
        poster_path={movie.poster_path}
        production_companies={movie.production_companies}
        release_date={movie.release_date}
        runtime={movie.runtime}
        spoken_languages={movie.spoken_languages}
      />
      <div className="fixed z-20 bottom-12 right-8 flex gap-4">
        <NavLink
          to={linkToSessions}
          className=" w-max bg-yellow-400 hover:bg-yellow-500 text-black py-4 px-6 rounded-full transition font-bold text-xl flex items-center gap-2"
        >
          <IoTicket style={{ width: "30px", height: "30px" }} />
          Select sessions
        </NavLink>
        <button
          onClick={handleAddToFavorite}
          className="w-16 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700 transition-colors focus:outline-none ring-2 ring-yellow-500"
          aria-label="Open search"
        >
          <FaHeart className="text-white text-sm" />
        </button>
      </div>
      <TrailerSection videos={movie.videos} />
      <ActorsSection cast={movie.cast} />
      <OtherMovies movieId={movie.id} />
    </div>
  );
};

export default MoviePage;
