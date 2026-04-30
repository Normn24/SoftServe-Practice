import { Star } from "lucide-react";
import { useGetMovieReviewsQuery } from "../../services/reviewsApi";

interface Props { movieId: number }

const getScoreColor = (score: number) =>
  score >= 8 ? "text-green-400" : score >= 5 ? "text-yellow-400" : "text-red-400";

export const MovieRatingBadge: React.FC<Props> = ({ movieId }) => {
  const { data } = useGetMovieReviewsQuery(movieId);
  if (!data || data.length === 0) return null;

  const avgRating = data.reduce((sum, review) => sum + review.averageRating, 0) / data.length;
  const count = data.length;

  return (
    <div>
      <p className="text-[18px] text-gray-400 leading-none pb-1">User ratings</p>
      <div className="flex items-center gap-2">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className={`text-lg font-bold ${getScoreColor(avgRating)}`}>
          {avgRating.toFixed(1)}
        </span>
        <span className="text-gray-400 text-sm">({count} reviews)</span>
      </div>
    </div>
  );
};