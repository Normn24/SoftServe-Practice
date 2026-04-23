import { Star, X, Heart } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  useGetFavoritesQuery,
  useDeleteFavoriteMutation,
} from "../../../services/favoritesApi";
import { FavoriteMovie } from "../../../types/authTypes";
import { useToastContext } from "../../../components/ToastContext/context";

const TMDB_IMG = "https://image.tmdb.org/t/p/w342";

const FavoriteCardSkeleton = () => (
  <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden animate-pulse">
    <div className="aspect-[2/3] bg-gray-800" />
    <div className="p-3 flex flex-col gap-2">
      <div className="h-4 bg-gray-800 rounded w-3/4" />
      <div className="h-3 bg-gray-800 rounded w-1/2" />
    </div>
  </div>
);

interface FavoriteCardProps {
  movie: FavoriteMovie;
  onRemove: (id: number) => void;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({ movie, onRemove }) => (
  <div className="group bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-yellow-400/30 transition relative">
    <div className="aspect-[2/3] bg-gray-800 overflow-hidden">
      <NavLink to={`/movies/${movie.id}`}>
        <img
          src={`${TMDB_IMG}${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </NavLink>
    </div>
    <div className="p-3">
      <NavLink to={`/movies/${movie.id}`}>
        <h3 className="font-semibold text-sm text-white truncate hover:text-yellow-400 transition-colors">
          {movie.title}
        </h3>
      </NavLink>
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-gray-400">
          {movie.release_date?.split("-")[0] ?? "—"}
        </span>
        <span className="flex items-center gap-1 text-xs text-yellow-400">
          <Star className="w-3 h-3 fill-yellow-400" />
          {movie.vote_average?.toFixed(1)}
        </span>
      </div>
      {movie.genres?.length > 0 && (
        <div className="flex gap-1 mt-1.5 flex-wrap">
          {movie.genres.slice(0, 2).map((g) => (
            <span
              key={g.id}
              className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400"
            >
              {g.name}
            </span>
          ))}
        </div>
      )}
    </div>
    <button
      onClick={() => onRemove(movie.id)}
      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-red-400"
      aria-label="Remove from favorites"
    >
      <X className="w-3.5 h-3.5" />
    </button>
  </div>
);

const FavoritesTab: React.FC = () => {
  const { showToast } = useToastContext();
  const { data: items = [], isLoading } = useGetFavoritesQuery();
  const [deleteFavorite] = useDeleteFavoriteMutation();

  const handleRemove = async (id: number) => {
    try {
      await deleteFavorite(id).unwrap();
      showToast("Removed from favorites", "info");
    } catch {
      showToast("Error removing", "error");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-wide">Favorite movies</h1>
        <p className="text-gray-400 text-sm mt-1">
          {isLoading ? "Loading..." : `${items.length} movies in collection`}
        </p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <FavoriteCardSkeleton key={i} />)}
        </div>
      )}

      {!isLoading && items?.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <Heart className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>You haven't added any movies yet</p>
        </div>
      )}

      {!isLoading && items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((m) => (
            <FavoriteCard key={m.id} movie={m} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesTab;