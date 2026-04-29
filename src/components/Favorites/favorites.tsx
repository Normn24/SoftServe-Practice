import React from "react";
import {
  useGetFavoritesQuery,
  useDeleteFavoriteMutation,
} from "../../services/favoritesApi";
import Loader from "../Loader";

const FavoritesPage: React.FC = () => {
  const { data: items = [], isLoading, isError } = useGetFavoritesQuery();
  const [deleteFavorite] = useDeleteFavoriteMutation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <Loader />
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-hero">
        <div className="overlay">
          <h1 className="page-title">My favorite movies</h1>
        </div>
      </div>

      <div className="favorites-container">
        {isError && (
          <p className="text-red-400">
            Failed to load favorites. Please try again.
          </p>
        )}

        {!isLoading && items.length === 0 && (
          <p className="text-gray-400">No favorites found.</p>
        )}

        {items.map((movie) => (
          <div className="movie-card" key={movie.id}>
            <img
              src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
              alt={movie.title}
              className="movie-poster"
            />
            <h3 className="movie-title">{movie.title}</h3>
            <button
              onClick={() => deleteFavorite(movie.id)}
              className="delete-button"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;