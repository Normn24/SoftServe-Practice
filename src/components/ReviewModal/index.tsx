import React, { useState } from "react";
import { X, Star, Send } from "lucide-react";
import { useCreateReviewMutation, useUpdateReviewMutation, Ratings, Review } from "../../services/reviewsApi";
import { useToastContext } from "../ToastContext/context";

interface ReviewModalProps {
  movieId: number;
  movieTitle: string;
  ticketId: string;
  onClose: () => void;
  initialReview?: Review;
}

const CRITERIA: { key: keyof Ratings; label: string; description: string }[] = [
  { key: "plot",      label: "Plot",          description: "How interesting and logical the story is" },
  { key: "acting",    label: "Acting",   description: "Convincingness and quality of performance" },
  { key: "visuals",   label: "Visuals",  description: "Cinematography, special effects" },
  { key: "sound",     label: "Sound",            description: "Soundtrack, sound design" },
  { key: "direction", label: "Direction",        description: "Overall vision and implementation" },
];

const getScoreColor = (score: number): string => {
  if (score >= 8) return "text-green-400";
  if (score >= 5) return "text-yellow-400";
  return "text-red-400";
};

const getScoreLabel = (score: number): string => {
  if (score >= 9) return "Masterpiece";
  if (score >= 7) return "Excellent";
  if (score >= 5) return "Good";
  if (score >= 3) return "Weak";
  return "Terrible";
};

const RatingSlider: React.FC<{
  criterion: typeof CRITERIA[number];
  value: number;
  onChange: (key: keyof Ratings, value: number) => void;
}> = ({ criterion, value, onChange }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <div>
        <span className="text-sm font-medium text-white">{criterion.label}</span>
        <p className="text-xs text-gray-500 mt-0.5">{criterion.description}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-lg font-bold tabular-nums ${getScoreColor(value)}`}>
          {value}
        </span>
        <span className={`text-xs ${getScoreColor(value)} hidden sm:block`}>
          {getScoreLabel(value)}
        </span>
      </div>
    </div>
    <input
      type="range"
      min={1}
      max={10}
      step={1}
      value={value}
      onChange={(e) => onChange(criterion.key, Number(e.target.value))}
      className="w-full h-1.5 rounded-full appearance-none cursor-pointer
        bg-gray-700
        [&::-webkit-slider-thumb]:appearance-none
        [&::-webkit-slider-thumb]:w-4
        [&::-webkit-slider-thumb]:h-4
        [&::-webkit-slider-thumb]:rounded-full
        [&::-webkit-slider-thumb]:bg-yellow-400
        [&::-webkit-slider-thumb]:cursor-pointer
        [&::-webkit-slider-thumb]:transition-transform
        [&::-webkit-slider-thumb]:hover:scale-110"
    />
    <div className="flex justify-between text-[10px] text-gray-600 px-0.5">
      <span>1</span>
      <span>5</span>
      <span>10</span>
    </div>
  </div>
);

const ReviewModal: React.FC<ReviewModalProps> = ({
  movieId,
  movieTitle,
  ticketId,
  onClose,
  initialReview,
}) => {
  const { showToast } = useToastContext();
  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();

  const isLoading = isCreating || isUpdating;

  const [ratings, setRatings] = useState<Ratings>(initialReview?.ratings || {
    plot: 7,
    acting: 7,
    visuals: 7,
    sound: 7,
    direction: 7,
  });
  const [comment, setComment] = useState(initialReview?.comment || "");

  const averageRating = (
    Object.values(ratings).reduce((a, b) => a + b, 0) / 5
  ).toFixed(1);

  const handleRatingChange = (key: keyof Ratings, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (initialReview) {
        await updateReview({ reviewId: initialReview._id, movieId, ticketId, ratings, comment }).unwrap();
        showToast("Review updated successfully!", "success");
      } else {
        await createReview({ movieId, movieTitle, ticketId, ratings, comment }).unwrap();
        showToast("Review published successfully!", "success");
      }
      onClose();
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      if (status === 409) {
        showToast("You have already left a review for this ticket", "error");
      } else {
        showToast(`Failed to ${initialReview ? 'update' : 'publish'} review`, "error");
      }
    }
  };
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-lg bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex items-start justify-between p-6 border-b border-gray-800 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white">{initialReview ? 'Edit your review' : 'Your review'}</h2>
            <p className="text-gray-400 text-sm mt-0.5 truncate max-w-[320px]">
              {movieTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition p-1 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          <div className="flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 shrink-0" />
            <span className="text-gray-400 text-sm">Overall rating</span>
            <span className={`ml-auto text-2xl font-bold tabular-nums ${getScoreColor(Number(averageRating))}`}>
              {averageRating}
            </span>
            <span className="text-xs text-gray-500">/10</span>
          </div>
          <div className="flex flex-col gap-5">
            {CRITERIA.map((c) => (
              <RatingSlider
                key={c.key}
                criterion={c}
                value={ratings[c.key]}
                onChange={handleRatingChange}
              />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white">
              Comment{" "}
              <span className="text-gray-500 font-normal">(optional)</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={1000}
              rows={3}
              placeholder="What impressed you the most?"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 resize-none transition"
            />
            <span className="text-xs text-gray-600 text-right">
              {comment.length}/1000
            </span>
          </div>
        </div>
        <div className="p-6 border-t border-gray-800 shrink-0">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {isLoading ? (initialReview ? "Updating..." : "Publishing...") : (initialReview ? "Update review" : "Publish review")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;