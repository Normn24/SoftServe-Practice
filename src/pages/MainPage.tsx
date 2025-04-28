import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../store/movieInCinema";
import { RootState, AppDispatch } from "../store/store";
import MovieCard from "../components/MovieCard";

const MoviesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { movieInCinema, error } = useSelector(
    (state: RootState) => state.movieInCinema
  );

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-10">
      {movieInCinema.map((movie) => (
        <MovieCard
          key={movie._id}
          title={movie.tmdbDetails.title}
          description={movie.tmdbDetails.overview}
          posterPath={movie.tmdbDetails.poster_path}
          imdb={movie.tmdbDetails.vote_average}
          year={movie.tmdbDetails.release_date.split("-")[0]}
          genre={movie.tmdbDetails.genres?.[0]?.name || "Unknown"}
          duration={movie.tmdbDetails.runtime}
          sessions={movie.sessions}
        />
      ))}
    </div>
  );
};

export default MoviesPage;
