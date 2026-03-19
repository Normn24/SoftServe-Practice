import { useState } from "react";
import { useUpdateSessionMutation } from "../../services/sessionsApi";
import { Seat } from "../../types/authTypes";

interface UpdateSessionProps {
  movieId: number;
  _id: string;
  dateTime: string;
  ticketPrice: number;
  countOfSeats?: Seat[];
}

export default function UpdateSession({
  movieId,
  _id,
  dateTime,
  ticketPrice,
  countOfSeats,
}: UpdateSessionProps) {
  const dateObj = new Date(dateTime);
  const initialDate = dateObj.toISOString().split("T")[0];
  const initialTime = dateObj.toISOString().split("T")[1].slice(0, 5);

  const [updateSession, { isLoading }] = useUpdateSessionMutation();

  const [newDate, setNewDate] = useState(initialDate);
  const [newTime, setNewTime] = useState(initialTime);
  const [newTicketPrice, setNewTicketPrice] = useState(ticketPrice);
  const [newCountOfSeats, setNewCountOfSeats] = useState(
    countOfSeats?.length ?? 0
  );

  const handleSubmit = async () => {
    await updateSession({
      movieId,
      sessionId: _id,
      session: {
        dateTime: `${newDate}T${newTime}`,
        price: newTicketPrice,
        seats: Array.from({ length: newCountOfSeats }, (_, i) => ({
          seatNumber: i + 1,
          isBooked: false,
        })),
      },
    });

    const dialog = document.getElementById(
      `add_session_${_id}`
    ) as HTMLDialogElement | null;
    dialog?.close();
  };

  return (
    <dialog
      id={`add_session_${_id}`}
      className="modal modal-bottom sm:modal-middle"
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg">Edit Session</h3>

        <div className="mt-4">
          <legend className="fieldset-legend">Choose date:</legend>
          <input
            type="date"
            className="input text-black w-full dark:text-white"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
        </div>

        <div>
          <legend className="fieldset-legend">Choose time:</legend>
          <input
            type="time"
            className="input text-black w-full dark:text-white"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
          />
        </div>

        <div>
          <label className="fieldset-legend">Ticket price:</label>
          <input
            type="number"
            className="input text-black w-full dark:text-white"
            placeholder="Type here"
            value={newTicketPrice}
            onChange={(e) => setNewTicketPrice(Number(e.target.value))}
          />
        </div>

        <div>
          <legend className="fieldset-legend">Count of Seats:</legend>
          <input
            type="number"
            className="input text-black w-full dark:text-white"
            placeholder="Type here"
            value={newCountOfSeats}
            onChange={(e) => setNewCountOfSeats(Number(e.target.value))}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            className="btn"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}