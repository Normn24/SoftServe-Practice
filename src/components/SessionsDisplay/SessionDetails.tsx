import React from "react";
import SeatGrid from "./SeatGrid";
import { SessionData } from "../../types/authTypes";
import { NavLink, useParams } from "react-router-dom";
import { formatDisplayTime } from "../../utils/dateUtils";

interface SessionDetailsProps {
  session: SessionData;
}

const SessionDetails: React.FC<SessionDetailsProps> = ({ session }) => {
  const { movieId } = useParams<{
    movieId: string;
  }>();
  const sessionTime = formatDisplayTime(session.session.dateTime);
  const freeSeats = session.session.seats.filter((s) => !s.isBooked).length;
  const priceInfo = `from ${session.session.price}₴`;

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white w-full">
      <NavLink to={`/${movieId}/sessions/${session.session._id}`}>
        <div className="mb-3">
          <p className="text-lg font-bold">
            {sessionTime}
            <span className="text-sm text-gray-400 pl-1.25">
              2D • Cinetech+
            </span>
          </p>
        </div>
        <SeatGrid seats={session.session.seats} />
        <div className="mt-3 text-xs text-gray-400">
          <p>
            There are {freeSeats} seats left {priceInfo}
          </p>
        </div>
      </NavLink>
    </div>
  );
};

export default SessionDetails;
