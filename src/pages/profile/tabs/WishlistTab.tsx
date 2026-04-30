import { Bookmark, Clock, X, CalendarDays, Play, Archive } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "../../../services/wishlistApi";
import { useToastContext } from "../../../components/ToastContext/context";

const getDaysUntil = (dateStr: string): number => {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const formatReleaseDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const WishlistSkeleton = () => (
  <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 flex items-center gap-4 animate-pulse">
    <div className="w-10 h-10 rounded-lg bg-gray-800 shrink-0" />
    <div className="flex-1 flex flex-col gap-2">
      <div className="h-4 bg-gray-800 rounded w-1/2" />
      <div className="h-3 bg-gray-800 rounded w-1/3" />
    </div>
    <div className="h-6 w-20 bg-gray-800 rounded-full" />
  </div>
);

interface WishlistCardProps {
  movieId: number;
  movieTitle: string;
  releaseDate: string;
  hasSessions: boolean;
  onRemove: (id: number) => void;
}

const WishlistCard: React.FC<WishlistCardProps> = ({
  movieId,
  movieTitle,
  releaseDate,
  hasSessions,
  onRemove,
}) => {
  const daysLeft = getDaysUntil(releaseDate);
  const isReleased = daysLeft <= 0;
  const isArchived = isReleased && !hasSessions;

  return (
    <div className={`group bg-gray-900 rounded-xl border p-4 flex items-center gap-4 transition ${
      isArchived
        ? "border-gray-700 opacity-80 hover:border-gray-600"
        : "border-gray-800 hover:border-yellow-400/20"
    }`}>
      <div className="w-10 h-10 rounded-lg bg-yellow-400/10 flex items-center justify-center shrink-0">
        <Bookmark className="w-5 h-5 text-yellow-400" />
      </div>

      <div className="flex-1 min-w-0">
        <NavLink
          to={`/movies/${movieId}`}
          className="font-semibold text-white truncate hover:text-yellow-400 transition-colors block"
        >
          {movieTitle}
        </NavLink>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
          <CalendarDays className="w-3 h-3 shrink-0" />
          <span>{formatReleaseDate(releaseDate)}</span>
        </div>
      </div>

      {isArchived ? (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-700/60 text-gray-400 shrink-0">
          <Archive className="w-3 h-3" />
          Archived
        </span>
      ) : isReleased ? (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-400/15 text-green-400 shrink-0">
          <Play className="w-3 h-3 fill-green-400" />
          Now playing
        </span>
      ) : (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-400/10 text-yellow-400 shrink-0">
          <Clock className="w-3 h-3" />
          {daysLeft === 1 ? "Tomorrow" : `${daysLeft} days`}
        </span>
      )}

      <button
        onClick={() => onRemove(movieId)}
        className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition p-1 shrink-0"
        aria-label="Remove from wishlist"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const WishlistTab: React.FC = () => {
  const { showToast } = useToastContext();
  const { data: wishlist = [], isLoading } = useGetWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const handleRemove = async (movieId: number) => {
    try {
      await removeFromWishlist(movieId).unwrap();
      showToast("Removed from Wishlist", "info");
    } catch {
      showToast("Error removing from Wishlist", "error");
    }
  };

  const sorted = [...wishlist].sort((a, b) => {
    const aLeft = getDaysUntil(a.releaseDate);
    const bLeft = getDaysUntil(b.releaseDate);
    const aArchived = aLeft <= 0 && !a.hasSessions;
    const bArchived = bLeft <= 0 && !b.hasSessions;
    // Архівні — завжди в кінець
    if (aArchived && !bArchived) return 1;
    if (!aArchived && bArchived) return -1;
    // Серед неархівних: спочатку «вже вийшли і ще йдуть», потім — очікувані
    if (aLeft > 0 && bLeft <= 0) return -1;
    if (aLeft <= 0 && bLeft > 0) return 1;
    return aLeft - bLeft;
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-wide">Wishlist</h1>
        <p className="text-gray-400 text-sm mt-1">
          {isLoading
            ? "Loading..."
            : `${wishlist.length} movies • you will receive an email 3 days before the premiere`}
        </p>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => <WishlistSkeleton key={i} />)}
        </div>
      )}

      {!isLoading && wishlist.length === 0 && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 border-dashed p-16 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-yellow-400/10 flex items-center justify-center">
            <Bookmark className="w-8 h-8 text-yellow-400/50" />
          </div>
          <div>
            <p className="font-semibold text-white">Wishlist empty</p>
            <p className="text-sm text-gray-500 mt-1">
              Add movies from the{" "}
              <NavLink to="/coming-soon" className="text-yellow-400 hover:underline">
                Coming Soon
              </NavLink>
            </p>
          </div>
        </div>
      )}

      {!isLoading && sorted.length > 0 && (
        <div className="flex flex-col gap-3">
          {sorted.map((item) => (
            <WishlistCard
              key={item.movieId}
              movieId={item.movieId}
              movieTitle={item.movieTitle}
              releaseDate={item.releaseDate}
              hasSessions={item.hasSessions}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistTab;