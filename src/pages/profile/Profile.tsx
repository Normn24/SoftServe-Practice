import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfile,
  updatePassword,
  updatePasswordLocaly,
} from "../../store/profileSlice";
import { useToastContext } from "../../components/ToastContext/context";
import {
  useGetUserTicketsQuery,
  useDeleteTicketMutation,
} from "../../services/ticketsApi";
import { NavLink } from "react-router-dom";

const formatDateTime = (dateTime: string | null): string => {
  if (!dateTime) return "—";
  return new Date(dateTime).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const TicketSkeleton = () => (
  <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg animate-pulse">
    <div className="w-12 h-18 bg-gray-700 rounded shrink-0" />
    <div className="flex flex-col gap-2 flex-1">
      <div className="h-4 bg-gray-700 rounded w-1/2" />
      <div className="h-3 bg-gray-700 rounded w-1/3" />
      <div className="h-3 bg-gray-700 rounded w-1/4" />
    </div>
  </div>
);

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const { showToast } = useToastContext();
  const user = useSelector((state: RootState) => state.profile.user);

  const [newPassword, setNewPassword] = useState("");
  const [password, setPassword] = useState("");

  const { data: tickets = [], isLoading: ticketsLoading } =
    useGetUserTicketsQuery();
  const [deleteTicket] = useDeleteTicketMutation();

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleUpdate = async () => {
    if (!newPassword.trim()) {
      showToast("Please enter a new password", "error");
      return;
    }
    if (newPassword.length < 7 || newPassword.length > 30) {
      showToast("Password must be between 7 and 30 characters", "error");
      return;
    }

    try {
      await dispatch(updatePassword({ password, newPassword })).unwrap();
      dispatch(updatePasswordLocaly({ newPassword }));
      setPassword("");
      setNewPassword("");
      showToast("Password updated successfully", "success");
    } catch {
      showToast(
        "Failed to update password. Check your current password.",
        "error"
      );
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    try {
      await deleteTicket(ticketId).unwrap();
      showToast("Ticket deleted", "success");
    } catch {
      showToast("Failed to delete ticket", "error");
    }
  };

  if (user.length === 0) return null;

  return (
    <section className="flex flex-col max-w-3xl mx-auto px-6 py-28 gap-10">

      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">User Profile</h1>

        <div className="flex flex-row items-center justify-between">
          <span className="font-medium text-xl">Email:</span>
          <input
            type="text"
            className="input text-white bg-gray-800 border border-gray-600 w-64"
            value={user[0].email}
            disabled
          />
        </div>

        <div className="flex flex-row items-center justify-between">
          <span className="font-medium text-xl">Old Password:</span>
          <input
            type="password"
            placeholder="Enter current password"
            className="input text-white bg-gray-800 border border-gray-600 w-64"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex flex-row items-center justify-between">
          <span className="font-medium text-xl">New Password:</span>
          <input
            type="password"
            placeholder="Enter new password"
            className="input text-white bg-gray-800 border border-gray-600 w-64"
            value={newPassword}
            minLength={7}
            maxLength={30}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <button
          className="btn btn-lg w-full bg-yellow-400 text-black border-none"
          onClick={handleUpdate}
        >
          Update password
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">My Tickets</h2>
          {!ticketsLoading && tickets.length > 0 && (
            <span className="text-gray-400 text-sm">{tickets.length} total</span>
          )}
        </div>

        {ticketsLoading && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => <TicketSkeleton key={i} />)}
          </div>
        )}

        {!ticketsLoading && tickets.length === 0 && (
          <p className="text-gray-400 text-center py-8">
            You haven't bought any tickets yet.
          </p>
        )}

        {!ticketsLoading && tickets.length > 0 && (
          <div className="flex flex-col gap-3">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="shrink-0 w-12 h-18">
                  {ticket.moviePoster ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${ticket.moviePoster}`}
                      alt={ticket.movieTitle ?? "Movie"}
                      className="w-12 h-18 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-18 bg-gray-700 rounded flex items-center justify-center text-gray-500 text-xs">
                      N/A
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <NavLink
                    to={`/movies/${ticket.movieId}`}
                    className="text-white font-semibold truncate hover:text-yellow-400 transition-colors"
                  >
                    {ticket.movieTitle ?? "Unknown Movie"}
                  </NavLink>
                  <span className="text-gray-400 text-sm">
                    {formatDateTime(ticket.sessionDateTime)}
                  </span>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-400">
                      Seat <span className="text-white font-medium">{ticket.seatNumber}</span>
                    </span>
                    {ticket.sessionPrice !== null && (
                      <span className="text-gray-400">
                        <span className="text-white font-medium">{ticket.sessionPrice}₴</span>
                      </span>
                    )}
                    {ticket.isUsed ? (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-gray-700 text-gray-400">
                        Used
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-400/20 text-yellow-400">
                        Active
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-gray-500 text-xs">
                    {new Date(ticket.bookingDate).toLocaleDateString("en-GB")}
                  </span>
                  <button
                    onClick={() => handleDeleteTicket(ticket._id)}
                    className="text-gray-500 hover:text-red-400 transition-colors text-xs"
                    aria-label="Delete ticket"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}