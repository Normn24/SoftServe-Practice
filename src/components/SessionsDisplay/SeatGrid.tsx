import React from "react";
import { Seat } from "../../types/authTypes";

interface SeatGridProps {
  seats: Seat[];
  onSeatSelect?: (seatId: string, seatNumber: number) => void;
}

const SeatGrid: React.FC<SeatGridProps> = ({ seats, onSeatSelect }) => {
  if (!seats || seats.length === 0) {
    return (
      <p className="text-gray-400">
        Information about locations is not available.
      </p>
    );
  }

  const getSeatClasses = (seat: Seat) => {
    const baseClasses =
      "w-5 h-7 md:w-6 rounded-t-lg m-0.5 flex items-center justify-center text-xs";
    if (seat.isBooked) {
      return `${baseClasses} bg-gray-600 cursor-not-allowed`;
    }
    return `${baseClasses} bg-gray-400 hover:bg-gray-300 cursor-pointer`;
  };

  const seatsPerRow = 10;
  const rows = [];
  for (let i = 0; i < seats.length; i += seatsPerRow) {
    rows.push(seats.slice(i, i + seatsPerRow));
  }

  return (
    <div className="bg-gray-800 p-2 md:p-4 rounded-lg">
      <div className="w-full h-0 border-b-[50px] border-l-[15px] border-r-[15px] border-b-white border-l-transparent border-r-transparent mb-5 rotate-180 shadow-[0px_-27px_32px_-23px_#ffffff]"></div>
      <div className="flex flex-col items-center space-y-1">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex justify-center items-center space-x-0.5"
          >
            <div className="w-6 text-center text-sm text-gray-400">
              {rowIndex + 1}
            </div>
            {row.map((seat) => (
              <button
                key={seat._id}
                disabled={seat.isBooked}
                onClick={() =>
                  onSeatSelect &&
                  !seat.isBooked &&
                  onSeatSelect(seat._id, seat.seatNumber)
                }
                className={getSeatClasses(seat)}
                aria-label={`Location ${seat.seatNumber}`}
              ></button>
            ))}
            <div className="w-6 text-center text-sm text-gray-400">
              {rowIndex + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatGrid;
