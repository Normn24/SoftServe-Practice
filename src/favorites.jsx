
import React, { useEffect, useState } from 'react';
import './FavoritesPage.css';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetch('https://soft-serve-practice-back.vercel.app/api/favorites')
      .then(res => res.json())
      .then(data => setFavorites(data))
      .catch(err => console.error('Помилка при завантаженні:', err));
  }, []);

  const handleDelete = (id) => {
    fetch(`https://soft-serve-practice-back.vercel.app/api/favorites/${id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Помилка при видаленні');
        setFavorites(prev => prev.filter(movie => movie.id !== id));
      })
      .catch(err => alert('Не вдалося видалити фільм'));
  };

  return (
    <div className="favorites-page">
      <div className="favorites-hero">
        <div className="overlay">
          <h1 className="page-title">Мої улюблені фільми</h1>
        </div>
      </div>
      <div className="favorites-container">
        {favorites.map(movie => (
          <div className="movie-card" key={movie.id}>
            <img src={movie.poster} alt={movie.title} className="movie-poster" />
            <h3 className="movie-title">{movie.title}</h3>
            <button onClick={() => handleDelete(movie.id)} className="delete-button">
              Видалити
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
