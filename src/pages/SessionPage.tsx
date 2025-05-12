import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchSessions, clearSessionsForDate } from "../store/sessionsSlice";
import DateTabs from "../components/SessionsDisplay/DateTabs";
import SessionDetails from "../components/SessionsDisplay/SessionDetails";
import { StatusEnum } from "../utils/EnumsFile";
import { useParams, useSearchParams } from "react-router-dom";
import { Movie } from "../types/authTypes";
import Loader from "../components/Loader";

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
  const { sessions, status } = useSelector(
    (state: RootState) => state.sessions
  );
  const { allMovie } = useSelector((state: RootState) => state.allMovies);

  const currentMovie = useMemo(() => {
    return allMovie.find(
      (movie: Movie) => String(movie.movieId) === String(movieId)
    );
  }, [allMovie, movieId]);

  const allMovieSessions = currentMovie?.sessions || [];

  const getInitialDate = useCallback((): string => {
    const dateFromUrl = searchParams.get("date");
    if (dateFromUrl && /^\d{4}-\d{2}-\d{2}$/.test(dateFromUrl)) {
      return dateFromUrl;
    }
    return formatDateToYYYYMMDD(new Date());
  }, [searchParams]);

  const [selectedDate, setSelectedDate] = useState<string>(getInitialDate());

  const handleDateSelect = useCallback(
    (date: string) => {
      setSelectedDate(date);
      setSearchParams({ date: date }, { replace: true });
    },
    [setSearchParams]
  );

  useEffect(() => {
    if (selectedDate && movieId) {
      dispatch(fetchSessions({ movieId, query: selectedDate }));
    } else if (movieId) {
      dispatch(clearSessionsForDate());
    }
  }, [dispatch, movieId, selectedDate]);

  useEffect(() => {
    const dateFromUrl = searchParams.get("date");
    if (
      dateFromUrl &&
      dateFromUrl !== selectedDate &&
      /^\d{4}-\d{2}-\d{2}$/.test(dateFromUrl)
    ) {
      setSelectedDate(dateFromUrl);
    }
  }, [searchParams, selectedDate, setSearchParams]);

  useEffect(() => {
    if (movieId) {
      const newInitialDate = getInitialDate();
      if (newInitialDate !== selectedDate) {
        setSelectedDate(newInitialDate);
      }
      dispatch(clearSessionsForDate());
    }
  }, [movieId, dispatch, getInitialDate, selectedDate]);

  return (
    <div className="p-4 text-white max-w-[1200px] m-auto">
      <h2 className="text-2xl font-semibold mb-4">Choose a session</h2>
      <DateTabs
        onDateSelect={handleDateSelect}
        allSessions={allMovieSessions}
        currentSelectedDate={selectedDate}
      />
      {status === StatusEnum.LOADING && <Loader />}
      {sessions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-6">
          {sessions.map((session) => (
            <SessionDetails key={session.session._id} session={session} />
          ))}
        </div>
      )}
      {status === StatusEnum.SUCCEEDED &&
        selectedDate &&
        sessions.length === 0 && (
          <p className="text-gray-400 text-center py-10">
            There are no sessions on the selected date.
          </p>
        )}
    </div>
  );
};

export default SessionPage;
