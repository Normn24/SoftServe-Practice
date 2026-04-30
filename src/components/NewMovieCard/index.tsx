import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { Movie } from "../../types/movieTypes";

interface NewMovieCardProps {
  movie: Pick<Movie, "id" | "title" | "poster_path" | "release_date">;
  isInWishlist: boolean;
  onToggleWishlist: (movieId: number, e: React.MouseEvent) => void;
}

const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

const NewMovieCard: React.FC<NewMovieCardProps> = memo(({ movie, isInWishlist, onToggleWishlist }) => {
  const releaseDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString("en-US", { month: "long", day: "numeric" })
    : "TBD";

  return (
    <div className="flex flex-col gap-3 group">
      <div className="relative rounded-xl overflow-hidden aspect-[2/3] bg-gray-800">
        {movie.poster_path ? (
          <img
            src={`${TMDB_IMG}${movie.poster_path}`}
            alt={movie.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
            No Poster
          </div>
        )}

        <Link 
          to={`/movies/${movie.id}`} 
          className="absolute inset-0 z-10" 
          aria-label={`View details for ${movie.title}`} 
        />

        <button
          onClick={(e) => onToggleWishlist(movie.id, e)}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/80 transition-colors"
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Bookmark
            className={`w-5 h-5 transition-colors ${
              isInWishlist ? "fill-yellow-400 text-yellow-400" : "text-white"
            }`}
          />
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-gray-400 text-xs md:text-sm">
          In cinemas from {releaseDate}
        </span>
        <Link
          to={`/movies/${movie.id}`}
          className="text-white font-bold text-base md:text-lg leading-tight hover:text-yellow-400 transition-colors line-clamp-2"
        >
          {movie.title}
        </Link>
      </div>
    </div>
  );
});

export default NewMovieCard;