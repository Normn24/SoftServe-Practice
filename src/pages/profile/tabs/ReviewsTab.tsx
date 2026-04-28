import { Star, MessageSquare } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useGetUserReviewsQuery, Review, Ratings } from "../../../services/reviewsApi";

const CRITERIA_LABELS: Record<keyof Ratings, string> = {
  plot:      "Plot",
  acting:    "Acting",
  visuals:   "Visuals",
  sound:     "Sound",
  direction: "Direction",
};

const getScoreColor = (score: number): string => {
  if (score >= 8) return "text-green-400";
  if (score >= 5) return "text-yellow-400";
  return "text-red-400";
};

const ReviewSkeleton = () => (
  <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 flex flex-col gap-4 animate-pulse">
    <div className="flex justify-between">
      <div className="h-4 bg-gray-800 rounded w-1/3" />
      <div className="h-4 bg-gray-800 rounded w-12" />
    </div>
    <div className="grid grid-cols-5 gap-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-12 bg-gray-800 rounded-lg" />
      ))}
    </div>
  </div>
);

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  const date = new Date(review.createdAt).toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 flex flex-col gap-4 hover:border-yellow-400/20 transition">
      <div className="flex items-start justify-between gap-4">
        <NavLink
          to={`/movies/${review.movieId}`}
          className="font-semibold text-white hover:text-yellow-400 transition-colors"
        >
          Movie #{review.movieId}
        </NavLink>
        <div className="flex items-center gap-1.5 shrink-0">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className={`text-lg font-bold ${getScoreColor(review.averageRating)}`}>
            {review.averageRating}
          </span>
          <span className="text-gray-500 text-sm">/10</span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {(Object.keys(CRITERIA_LABELS) as (keyof Ratings)[]).map((key) => (
          <div
            key={key}
            className="flex flex-col items-center gap-1 bg-gray-800 rounded-lg p-2"
          >
            <span className={`text-base font-bold ${getScoreColor(review.ratings[key])}`}>
              {review.ratings[key]}
            </span>
            <span className="text-[10px] text-gray-500 text-center leading-tight">
              {CRITERIA_LABELS[key]}
            </span>
          </div>
        ))}
      </div>

      {review.comment && (
        <p className="text-sm text-gray-400 border-t border-gray-800 pt-3 leading-relaxed">
          {review.comment}
        </p>
      )}

      <span className="text-xs text-gray-600">{date}</span>
    </div>
  );
};

const ReviewsTab: React.FC = () => {
  const { data: reviews = [], isLoading } = useGetUserReviewsQuery();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-wide">My reviews</h1>
        <p className="text-gray-400 text-sm mt-1">
          {isLoading ? "Loading..." : `${reviews.length} reviews`}
        </p>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-4">
          {[1, 2].map((i) => <ReviewSkeleton key={i} />)}
        </div>
      )}

      {!isLoading && reviews.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>You haven't left any reviews yet</p>
          <p className="text-xs text-gray-600 mt-1">
            After watching a movie, go to "Used" tickets
          </p>
        </div>
      )}

      {!isLoading && reviews.length > 0 && (
        <div className="flex flex-col gap-4">
          {reviews.map((r) => <ReviewCard key={r._id} review={r} />)}
        </div>
      )}
    </div>
  );
};

export default ReviewsTab;