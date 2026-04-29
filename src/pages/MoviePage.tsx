import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useGetSingleMovieQuery } from "../services/moviesApi";
import { useAddFavoriteMutation } from "../services/favoritesApi";
import { ActorsSection } from "../components/MovieComponents/ActorsSection";
import { BackdropSection } from "../components/MovieComponents/BackdropSection";
import { MovieDetailsSection } from "../components/MovieComponents/MovieDetailsSection";
import { TrailerSection } from "../components/MovieComponents/TrailerSection";
import OtherMovies from "../components/MovieComponents/OtherMovies";
import Loader from "../components/Loader";
import { IoTicket } from "react-icons/io5";
import { FaHeart, FaHome } from "react-icons/fa";
import { RoutePaths } from "../utils/EnumsFile";
import { formatDateToYYYYMMDD } from "../utils/dateUtils";

const MoviePage: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();

  const {
    data: movie,
    isLoading,
  } = useGetSingleMovieQuery(movieId ? +movieId : skipToken);

  const [addFavorite, { isLoading: isFavoriteLoading }] =
    useAddFavoriteMutation();

  if (isLoading || !movie) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <Loader />
      </div>
    );
  }

  const today = new Date();
  const closestSession = movie.sessions
    .filter((s) => new Date(s.dateTime) >= today)
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())[0];
  const hasSessions = movie.sessions.some(s => new Date(s.dateTime) > new Date());


  const sessionsPath = RoutePaths.MOVIESESSIONS.replace(
    ":movieId",
    movieId ?? ""
  );
  const linkToSessions = closestSession
    ? `${sessionsPath}?date=${formatDateToYYYYMMDD(new Date(closestSession.dateTime))}`
    : sessionsPath;

  return (
    <div className="relative h-full flex flex-col gap-6 mb-32">
      <BackdropSection
        backdrop_path={movie.backdrop_path}
        title={movie.title}
        overview={movie.tagline}
        imdb={movie.vote_average}
        year={movie.release_date?.split("-")[0] ?? ""}
        genre={movie.genres?.[0]?.name ?? ""}
        duration={movie.runtime}
      />

      <div className="absolute z-10 top-26 flex items-center mb-6 left-8">
        <NavLink
          to="/"
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
        {hasSessions && (
          <NavLink
            to={linkToSessions}
            className="w-max bg-yellow-400 hover:bg-yellow-500 text-black py-4 px-6 rounded-full transition font-bold text-xl flex items-center gap-2"
          >
            <IoTicket style={{ width: "30px", height: "30px" }} />
            Select sessions
          </NavLink>
        )}
        <button
          onClick={() => movieId && addFavorite(+movieId)}
          disabled={isFavoriteLoading}
          className="w-16 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700 transition-colors focus:outline-none ring-2 ring-yellow-500 disabled:opacity-50"
          aria-label="Add to favorites"
        >
          <FaHeart className="text-white text-sm" />
        </button>
      </div>

      {movie.videos?.length > 0 && <TrailerSection videos={movie.videos} />}
      <ActorsSection cast={movie.cast} />
      <OtherMovies movieId={movie.id} />
    </div>
  );
};

export default MoviePage;