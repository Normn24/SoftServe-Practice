import React from "react";
import { useGetUpcomingMoviesQuery } from "../../services/moviesApi";
import NewMovieCard from "../NewMovieCard";
import Loader from "../Loader";

const NewMovies: React.FC = () => {
  const { data: moviesUpcoming = [], isLoading } = useGetUpcomingMoviesQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <Loader />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center pt-24"
      style={{
        backgroundImage:
          "radial-gradient(black 55%, #0000), linear-gradient(135deg, deeppink, indigo, blue, cyan, lime, yellow, orange, red)",
        backgroundSize: "100% 0.5%, contain",
        backgroundRepeat: "repeat-y",
      }}
    >
      <div className="grid grid-cols-4 gap-6 p-6 w-full max-w-[1400px]">
        {moviesUpcoming.map((movie) => (
          <NewMovieCard
            key={movie.movieId}
            movieId={movie.movieId}
            title={movie.tmdbDetails?.title ?? "N/A"}
            description={movie.tmdbDetails?.overview ?? ""}
            posterPath={movie.tmdbDetails?.poster_path}
          />
        ))}
      </div>

      {moviesUpcoming.length === 0 && !isLoading && (
        <p className="text-gray-400 mt-12">No upcoming movies at the moment.</p>
      )}
    </div>
  );
};

export default NewMovies;