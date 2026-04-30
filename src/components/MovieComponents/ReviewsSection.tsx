import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  useGetMovieReviewsQuery,
  useCreateReviewMutation,
  type Ratings,
} from "../../services/reviewsApi";
import { useGetUsedTicketsForMovieQuery } from "../../services/ticketsApi";
import { useToastContext } from "../ToastContext/context";
import {
  Star,
  ChevronDown,
  ChevronUp,
  MessageSquarePlus,
  Film,
  Mic2,
  Eye,
  Music,
  Clapperboard,
  Send,
  X,
} from "lucide-react";

// ─── helpers ─────────────────────────────────────────────────────────────────

const CATEGORIES: { key: keyof Ratings; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { key: "plot",      label: "Plot",      Icon: Film },
  { key: "acting",    label: "Acting",    Icon: Mic2 },
  { key: "visuals",   label: "Visuals",   Icon: Eye },
  { key: "sound",     label: "Sound",     Icon: Music },
  { key: "direction", label: "Direction", Icon: Clapperboard },
];

const ratingColor = (v: number) => {
  if (v >= 8) return "text-green-400";
  if (v >= 5) return "text-yellow-400";
  return "text-red-400";
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// ─── RatingSlider ─────────────────────────────────────────────────────────────

interface RatingSliderProps {
  label: string;
  Icon: React.FC<{ className?: string }>;
  value: number;
  onChange: (v: number) => void;
}

const RatingSlider: React.FC<RatingSliderProps> = ({ label, Icon, value, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between text-xs">
      <span className="flex items-center gap-1.5 text-gray-400 font-medium">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </span>
      <span className={`font-bold text-sm tabular-nums ${ratingColor(value)}`}>
        {value}<span className="text-gray-600 font-normal">/10</span>
      </span>
    </div>
    <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all duration-150"
        style={{
          width: `${value * 10}%`,
          background: value >= 8
            ? "linear-gradient(to right,#4ade80,#22c55e)"
            : value >= 5
            ? "linear-gradient(to right,#fbbf24,#f59e0b)"
            : "linear-gradient(to right,#f87171,#ef4444)",
        }}
      />
    </div>
    <input
      type="range"
      min={1}
      max={10}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-yellow-400 cursor-pointer opacity-0 absolute"
      style={{ marginTop: "-14px", height: "14px" }}
    />
    {/* clickable dots row */}
    <div className="flex gap-1 mt-0.5">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`flex-1 h-1.5 rounded-full transition-all ${
            n <= value ? "bg-yellow-400" : "bg-gray-700 hover:bg-gray-600"
          }`}
        />
      ))}
    </div>
  </div>
);

// ─── ReviewCard ───────────────────────────────────────────────────────────────

interface ReviewCardProps {
  averageRating: number;
  ratings: Ratings;
  comment: string;
  createdAt: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ averageRating, ratings, comment, createdAt }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gray-900 border border-gray-800 p-5 flex flex-col gap-4 hover:border-gray-700 transition">
      {/* top row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-yellow-400/10 flex items-center justify-center">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          </div>
          <span className={`text-2xl font-bold tabular-nums ${ratingColor(averageRating)}`}>
            {averageRating.toFixed(1)}
          </span>
          <span className="text-gray-600 text-sm">/10</span>
        </div>
        <span className="text-xs text-gray-500">{formatDate(createdAt)}</span>
      </div>

      {/* mini rating bars */}
      <div className="grid grid-cols-5 gap-2">
        {CATEGORIES.map(({ key, label }) => (
          <div key={key} className="flex flex-col items-center gap-1">
            <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${ratings[key] * 10}%`,
                  background:
                    ratings[key] >= 8
                      ? "#4ade80"
                      : ratings[key] >= 5
                      ? "#fbbf24"
                      : "#f87171",
                }}
              />
            </div>
            <span className="text-[10px] text-gray-500">{label}</span>
            <span className={`text-xs font-semibold tabular-nums ${ratingColor(ratings[key])}`}>
              {ratings[key]}
            </span>
          </div>
        ))}
      </div>

      {/* comment */}
      {comment && (
        <div>
          <p className={`text-sm text-gray-300 leading-relaxed ${!expanded ? "line-clamp-2" : ""}`}>
            {comment}
          </p>
          {comment.length > 120 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-1 text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1 transition"
            >
              {expanded ? <><ChevronUp className="w-3 h-3" /> Show less</> : <><ChevronDown className="w-3 h-3" /> Read more</>}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ─── WriteReviewForm ──────────────────────────────────────────────────────────

interface WriteReviewFormProps {
  movieId: number;
  movieTitle: string;
  eligibleTicketId: string;
  onClose: () => void;
}

const DEFAULT_RATINGS: Ratings = { plot: 7, acting: 7, visuals: 7, sound: 7, direction: 7 };

const WriteReviewForm: React.FC<WriteReviewFormProps> = ({
  movieId,
  movieTitle,
  eligibleTicketId,
  onClose,
}) => {
  const [ratings, setRatings] = useState<Ratings>(DEFAULT_RATINGS);
  const [comment, setComment] = useState("");
  const [createReview, { isLoading }] = useCreateReviewMutation();
  const { showToast } = useToastContext();

  const avg = +(Object.values(ratings).reduce((a, b) => a + b, 0) / 5).toFixed(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReview({ movieId, movieTitle, ticketId: eligibleTicketId, ratings, comment }).unwrap();
      showToast("Review submitted! Thank you 🎬", "success");
      onClose();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? (err as { data: { message: string } }).data?.message
          : "Failed to submit review";
      showToast(msg, "error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 border border-yellow-400/30 rounded-2xl p-6 flex flex-col gap-6 shadow-xl shadow-yellow-400/5"
    >
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <MessageSquarePlus className="w-5 h-5 text-yellow-400" />
            Write a Review
          </h3>
          <p className="text-gray-500 text-xs mt-0.5">Share your experience watching this film</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`text-3xl font-black tabular-nums ${ratingColor(avg)}`}>
            {avg}
            <span className="text-base text-gray-500 font-normal">/10</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-600 hover:text-gray-400 transition p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {CATEGORIES.map(({ key, label, Icon }) => (
          <RatingSlider
            key={key}
            label={label}
            Icon={Icon}
            value={ratings[key]}
            onChange={(v) => setRatings((r) => ({ ...r, [key]: v }))}
          />
        ))}
      </div>

      {/* comment */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-400 font-medium">
          Comment <span className="text-gray-600">(optional)</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={1000}
          rows={3}
          placeholder="What did you think about the movie?"
          className="bg-gray-800 border border-gray-700 focus:border-yellow-400/60 outline-none rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 resize-none transition"
        />
        <span className="text-right text-xs text-gray-600">{comment.length}/1000</span>
      </div>

      {/* submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="self-end flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold px-6 py-2.5 rounded-full transition"
      >
        <Send className="w-4 h-4" />
        {isLoading ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
};

// ─── ReviewsSection (main export) ────────────────────────────────────────────

interface ReviewsSectionProps {
  movieId: number;
  movieTitle: string;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ movieId, movieTitle }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = !!token;

  const { data: reviews = [], isLoading: reviewsLoading } = useGetMovieReviewsQuery(movieId);
  const { data: usedTickets = [] } = useGetUsedTicketsForMovieQuery(movieId, {
    skip: !isAuthenticated,
  });

  // квиток який ще не прив'язаний до жодного ревю
  const eligibleTicket = useMemo(() => {
    if (!usedTickets.length) return null;
    const reviewedTicketIds = new Set(reviews.map((r) => r.ticketId));
    return usedTickets.find((t) => !reviewedTicketIds.has(t._id)) ?? null;
  }, [usedTickets, reviews]);

  const [formOpen, setFormOpen] = useState(false);

  const avgAll =
    reviews.length > 0
      ? +(reviews.reduce((s, r) => s + r.averageRating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <section className="w-[80rem] m-auto flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Reviews
            {reviews.length > 0 && (
              <span className="ml-2 text-base text-gray-500 font-normal">({reviews.length})</span>
            )}
          </h2>
          {avgAll !== null && (
            <p className="text-sm text-gray-400 mt-0.5">
              Average rating:{" "}
              <span className={`font-bold ${ratingColor(avgAll)}`}>{avgAll}/10</span>
            </p>
          )}
        </div>

        {/* write review button */}
        {isAuthenticated && eligibleTicket && !formOpen && (
          <button
            onClick={() => setFormOpen(true)}
            className="flex items-center gap-2 bg-yellow-400/10 hover:bg-yellow-400/20 border border-yellow-400/30 text-yellow-400 font-semibold px-5 py-2 rounded-full text-sm transition"
          >
            <MessageSquarePlus className="w-4 h-4" />
            Write a Review
          </button>
        )}
      </div>

      {/* ── write form ── */}
      {formOpen && eligibleTicket && (
        <WriteReviewForm
          movieId={movieId}
          movieTitle={movieTitle}
          eligibleTicketId={eligibleTicket._id}
          onClose={() => setFormOpen(false)}
        />
      )}

      {/* ── list ── */}
      {reviewsLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-900 rounded-xl border border-gray-800 p-5 animate-pulse h-28" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="w-full bg-gray-900 border border-gray-800 border-dashed p-12 flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-full bg-yellow-400/10 flex items-center justify-center">
            <Star className="w-7 h-7 text-yellow-400/50" />
          </div>
          <p className="font-semibold text-white">No reviews yet</p>
          <p className="text-sm text-gray-500">
            {isAuthenticated && eligibleTicket
              ? "Be the first to share your thoughts!"
              : "Be the first to watch and review this movie."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((r) => (
            <ReviewCard
              key={r._id}
              averageRating={r.averageRating}
              ratings={r.ratings}
              comment={r.comment}
              createdAt={r.createdAt}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;
