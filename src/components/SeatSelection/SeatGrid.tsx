import React from "react";
import { Seat } from "../../types/authTypes";

interface RenderableSeat extends Seat {
  isSelected: boolean;
}

interface SeatGridProps {
  seats: RenderableSeat[];
  onSeatClick: (seat: Seat) => void;
}

const SeatGrid: React.FC<SeatGridProps> = ({ seats, onSeatClick }) => {
  const seatsPerRow = 10;
  const rows = [];
  for (let i = 0; i < seats.length; i += seatsPerRow) {
    rows.push(seats.slice(i, i + seatsPerRow));
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex justify-center items-center space-x-3"
        >
          <div className="w-6 text-center text-sm text-gray-400">
            {rowIndex + 1}
          </div>
          {row.map((seat) => {
            let seatClasses =
              "w-7 h-9 md:w-9 md:h-10 rounded-t-lg flex items-center justify-center text-xs font-mono cursor-pointer transition duration-100 ease-in-out";
            if (seat.isBooked) {
              seatClasses += " bg-yellow-500 cursor-not-allowed";
            } else if (seat.isSelected) {
              seatClasses +=
                " border-2 border-blue-500 bg-blue-500 text-white scale-110";
            } else if (seat.seatNumber > 0) {
              seatClasses += " bg-gray-600 hover:bg-gray-500";
            } else {
              seatClasses += " invisible";
            }
            return (
              <div
                key={seat._id}
                className={seatClasses}
                onClick={() => !seat.isBooked && onSeatClick(seat)}
                title={`Row ${rowIndex + 1}, Seat ${seat.seatNumber}${
                  seat.isBooked ? " (Booked)" : ""
                }${seat.isSelected ? " (Selected)" : ""}`}
              >
                {!seat.isBooked && seat.seatNumber > 0 && seat.seatNumber}
              </div>
            );
          })}
          <div className="w-6 text-center text-sm text-gray-400">
            {rowIndex + 1}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SeatGrid;
