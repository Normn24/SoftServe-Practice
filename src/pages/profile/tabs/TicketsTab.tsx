import { useState, useMemo } from "react";
import { CalendarDays, Film, Trash2, Ticket } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  useGetUserTicketsQuery,
  useDeleteTicketMutation,
  UserTicket,
} from "../../../services/ticketsApi";
import { useToastContext } from "../../../components/ToastContext/context";

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
  onDelete: (id: string) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onDelete }) => (
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

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-400">
            Місце <span className="text-white font-medium">{ticket.seatNumber}</span>
          </span>
          {ticket.sessionPrice !== null && (
            <span className="text-yellow-400 font-semibold">
              {ticket.sessionPrice}₴
            </span>
          )}
        </div>
        {!ticket.isUsed && (
          <button
            onClick={() => onDelete(ticket._id)}
            className="text-gray-600 hover:text-red-400 transition p-1"
            aria-label="Видалити квиток"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  </div>
);

const EmptyState: React.FC<{ tab: InnerTab }> = ({ tab }) => (
  <div className="text-center py-16 text-gray-500">
    <Ticket className="w-10 h-10 mx-auto mb-3 opacity-30" />
    <p>{tab === "active" ? "Немає активних квитків" : "Немає використаних квитків"}</p>
  </div>
);

const TicketsTab: React.FC = () => {
  const { showToast } = useToastContext();
  const { data: tickets = [], isLoading } = useGetUserTicketsQuery();
  const [deleteTicket] = useDeleteTicketMutation();
  const [innerTab, setInnerTab] = useState<InnerTab>("active");

  const handleDelete = async (id: string) => {
    try {
      await deleteTicket(id).unwrap();
      showToast("Квиток видалено", "success");
    } catch {
      showToast("Помилка видалення квитка", "error");
    }
  };

  const { active, used } = useMemo(() => {
    const now = new Date();
    return {
      active: tickets.filter(
        (t) => !t.isUsed && (t.sessionDateTime ? new Date(t.sessionDateTime) >= now : true)
      ),
      used: tickets.filter(
        (t) => t.isUsed || (t.sessionDateTime ? new Date(t.sessionDateTime) < now : false)
      ),
    };
  }, [tickets]);

  const displayed = innerTab === "active" ? active : used;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-wide">Мої квитки</h1>
        <p className="text-gray-400 text-sm mt-1">
          {isLoading
            ? "Завантаження..."
            : `${tickets.length} квитків загалом`}
        </p>
      </div>

      {/* Inner tabs */}
      <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit">
        <button
          onClick={() => setInnerTab("active")}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            innerTab === "active"
              ? "bg-yellow-400 text-black"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Активні
          {!isLoading && active.length > 0 && (
            <span
              className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                innerTab === "active"
                  ? "bg-black/20 text-black"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              {active.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setInnerTab("used")}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            innerTab === "used"
              ? "bg-yellow-400 text-black"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Використані
          {!isLoading && used.length > 0 && (
            <span
              className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                innerTab === "used"
                  ? "bg-black/20 text-black"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              {used.length}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => <TicketSkeleton key={i} />)}
        </div>
      ) : displayed.length === 0 ? (
        <EmptyState tab={innerTab} />
      ) : (
        <div className="flex flex-col gap-3">
          {displayed.map((t) => (
            <TicketCard key={t._id} ticket={t} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketsTab;