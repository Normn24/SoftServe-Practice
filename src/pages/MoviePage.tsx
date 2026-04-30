import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useGetSingleMovieQuery } from "../services/moviesApi";
import { useAddFavoriteMutation, useDeleteFavoriteMutation, useGetFavoritesQuery } from "../services/favoritesApi";
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

  const [addFavorite] = useAddFavoriteMutation();
  const [deleteFavorite] = useDeleteFavoriteMutation();  
  
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = !!token;

  const { data: favorites = [] } = useGetFavoritesQuery(undefined, { skip: !isAuthenticated });
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(favorites.some(f => f.id === +movieId!));
  }, [favorites, movieId]);  

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
        id={+movieId!}
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
        {isAuthenticated && (
          <button
            onClick={() => isFav ? deleteFavorite(+movieId!) : addFavorite(+movieId!)}
            className={`flex items-center gap-2 py-2 px-6 max-h-[62px] min-h-[62px] rounded-full font-bold transition-colors duration-200 ${
              isFav
                ? "bg-red-500 hover:bg-red-600 text-white ring-2 ring-red-500"
                : "bg-gray-800 hover:bg-gray-700 text-white ring-2 ring-yellow-500"
            }`}
          >
            <FaHeart className={isFav ? "fill-white" : "fill-transparent stroke-white stroke-30"} style={{ width: "18px", height: "18px" }} />
          </button>
        )}
      </div>

      {movie.videos?.length > 0 && <TrailerSection videos={movie.videos} />}
      <ActorsSection cast={movie.cast} />
      <OtherMovies movieId={movie.id} />
    </div>
  );
};

export default MoviePage;