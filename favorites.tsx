
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {RootState, AppDispatch} from '../../store/store';
import { fetchFavorites, deleteFavorite } from '../../store/favoritesSlice';
import '../../favorites_style.css';


const FavoritesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.favorites);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    dispatch(deleteFavorite(id));
  };

  return (
    <div className="favorites-page">
      <div className="favorites-hero">
        <div className="overlay">
          <h1 className="page-title">My favorite movies</h1>
        </div>
      </div>
      <div className="favorites-container">
        {loading && <p>Loading favorites...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && items.length === 0 && <p>No favorites found.</p>}
        {items.map((movie) => (
          <div className="movie-card" key={movie.movieId}>
           <img 
              src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
              alt={movie.title}
              className="movie-poster"
            />
            <h3 className="movie-title">{movie.title}</h3>
            <button onClick={() => handleDelete(movie.movieId)} className="delete-button">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
