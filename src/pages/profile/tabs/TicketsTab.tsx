import { useCallback, useState } from "react";
import { CalendarDays, Film, Trash2, Ticket, MessageSquarePlus, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  useGetUserTicketsQuery,
  useDeleteTicketMutation,
  UserTicket,
} from "../../../services/ticketsApi";
import { useCheckReviewExistsQuery } from "../../../services/reviewsApi";
import { useToastContext } from "../../../components/ToastContext/context";
import ReviewModal from "../../../components/ReviewModal";

const TMDB_IMG = "https://image.tmdb.org/t/p/w185";

type InnerTab = "active" | "used";

const formatDateTime = (dt: string | null): string => {
  if (!dt) return "—";
  return new Date(dt).toLocaleString("uk-UA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const TicketSkeleton = () => (
  <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 flex gap-4 animate-pulse">
    <div className="w-16 h-24 rounded-lg bg-gray-800 shrink-0" />
    <div className="flex-1 flex flex-col justify-between gap-3">
      <div className="h-4 bg-gray-800 rounded w-2/3" />
      <div className="h-3 bg-gray-800 rounded w-1/2" />
      <div className="h-3 bg-gray-800 rounded w-1/4" />
    </div>
  </div>
);

interface TicketCardProps {
  ticket: UserTicket;
  isUsed: boolean;
  onDelete: (id: string) => void;
  onReview: (ticket: UserTicket) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, isUsed, onDelete, onReview }) => {
  const { data: reviewCheck } = useCheckReviewExistsQuery(ticket._id, {
    skip: !isUsed,
  });

  const alreadyReviewed = reviewCheck?.exists ?? false;

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 flex gap-4 transition hover:border-yellow-400/20">
      <div className="w-16 h-24 rounded-lg overflow-hidden shrink-0 bg-gray-800">
        {ticket.moviePoster ? (
          <img
            src={`${TMDB_IMG}${ticket.moviePoster}`}
            alt={ticket.movieTitle ?? "Movie"}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Film className="w-6 h-6 text-gray-600" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <NavLink
            to={`/movies/${ticket.movieId}`}
            className="font-semibold text-white truncate hover:text-yellow-400 transition-colors block"
          >
            {ticket.movieTitle ?? "Невідомий фільм"}
          </NavLink>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-400">
            <CalendarDays className="w-3 h-3 shrink-0" />
            <span>{formatDateTime(ticket.sessionDateTime)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 gap-2 flex-wrap">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400">
              Місце{" "}
              <span className="text-white font-medium">{ticket.seatNumber}</span>
            </span>
            {ticket.sessionPrice !== null && (
              <span className="text-yellow-400 font-semibold">
                {ticket.sessionPrice}₴
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isUsed && (
              alreadyReviewed ? (
                <span className="flex items-center gap-1.5 text-xs text-green-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Review left
                </span>
              ) : (
                <button
                  onClick={() => onReview(ticket)}
                  className="flex items-center gap-1.5 text-xs text-yellow-400 hover:text-yellow-300 transition font-medium"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5" />
                  Write review
                </button>
              )
            )}

            {!isUsed && (
              <button
                onClick={() => onDelete(ticket._id)}
                className="text-gray-600 hover:text-red-400 transition p-1"
                aria-label="Delete ticket"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyState: React.FC<{ tab: InnerTab }> = ({ tab }) => (
  <div className="text-center py-16 text-gray-500">
    <Ticket className="w-10 h-10 mx-auto mb-3 opacity-30" />
    <p>
      {tab === "active"
        ? "No active tickets"
        : "No used tickets"}
    </p>
  </div>
);

const TicketsTab: React.FC = () => {
  const { showToast } = useToastContext();
  const [innerTab, setInnerTab] = useState<InnerTab>("active");
  const [page, setPage] = useState(1);
  const limit = 5; 

  const { data, isLoading, isFetching } = useGetUserTicketsQuery({ 
    page, 
    limit, 
    status: innerTab 
  });
  
  const [deleteTicket] = useDeleteTicketMutation();
  const [reviewTarget, setReviewTarget] = useState<UserTicket | null>(null);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteTicket(id).unwrap();
      showToast("Ticket deleted", "success");
      if (data?.tickets.length === 1 && page > 1) {
        setPage((p) => p - 1);
      }
    } catch {
      showToast("Error deleting ticket", "error");
    }
  }, [deleteTicket, showToast, data?.tickets.length, page]);

  const handleTabChange = useCallback((tab: InnerTab) => {
    setInnerTab(tab);
    setPage(1); 
  }, []);

  const tickets = data?.tickets ?? [];
  const pagination = data?.pagination;

  return (
    <>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide">My tickets</h1>
          <p className="text-gray-400 text-sm mt-1">
            {isLoading ? "Loading..." : `${pagination?.totalTickets ?? 0} tickets found`}
          </p>
        </div>

        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit">
          {(["active", "used"] as InnerTab[]).map((tab) => {
            const isActive = innerTab === tab;
            return (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive ? "bg-yellow-400 text-black" : "text-gray-400 hover:text-white"
                }`}
                disabled={isFetching}
              >
                {tab === "active" ? "Active" : "Used"}
              </button>
            );
          })}
        </div>

        {isLoading || isFetching ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => <TicketSkeleton key={i} />)}
          </div>
        ) : tickets.length === 0 ? (
          <EmptyState tab={innerTab} />
        ) : (
          <div className="flex flex-col gap-3">
            {tickets.map((t) => (
              <TicketCard
                key={t._id}
                ticket={t}
                isUsed={innerTab === "used"}
                onDelete={handleDelete}
                onReview={setReviewTarget}
              />
            ))}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 bg-gray-900 p-3 rounded-xl border border-gray-800">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isFetching}
              className="p-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-gray-400">
              Page <span className="text-white">{page}</span> of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages || isFetching}
              className="p-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {reviewTarget && (
        <ReviewModal
          movieId={reviewTarget.movieId}
          movieTitle={reviewTarget.movieTitle ?? "Movie"}
          ticketId={reviewTarget._id}
          onClose={() => setReviewTarget(null)}
        />
      )}
    </>
  );
};

export default TicketsTab;