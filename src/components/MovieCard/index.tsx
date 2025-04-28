import React from "react";
import { Session } from "../../types/authTypes";
import { IoTicket } from "react-icons/io5";

interface MovieCardProps {
  title: string;
  description: string;
  posterPath: string;
  imdb: number;
  year: string;
  genre: string;
  duration: number;
  sessions: Session[];
}

const MovieCard: React.FC<MovieCardProps> = ({
  title,
  description,
  posterPath,
  imdb,
  year,
  genre,
  duration,
  sessions,
}) => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  // Групуємо сеанси за датами
  const todaySessions = sessions.filter(
    (session) =>
      new Date(session.dateTime).toDateString() === today.toDateString()
  );

  const tomorrowSessions = sessions.filter(
    (session) =>
      new Date(session.dateTime).toDateString() === tomorrow.toDateString()
  );

  let sessionLabel = "";
  let sessionTimes: string[] = [];

  if (todaySessions.length > 0) {
    sessionLabel = "Sessions today:";
    sessionTimes = todaySessions.map((session) =>
      new Date(session.dateTime).toLocaleTimeString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  } else if (tomorrowSessions.length > 0) {
    sessionLabel = "Sessions tomorrow:";
    sessionTimes = tomorrowSessions.map((session) =>
      new Date(session.dateTime).toLocaleTimeString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  } else {
    const futureSessions = sessions
      .filter((session) => new Date(session.dateTime) > today)
      .sort(
        (a, b) =>
          new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
      );

    if (futureSessions.length > 0) {
      const closestDate = new Date(futureSessions[0].dateTime);
      const formattedDate = closestDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
      });

      sessionLabel = `Sessions ${formattedDate}:`;

      const sessionsOnClosestDate = sessions.filter(
        (session) =>
          new Date(session.dateTime).toDateString() ===
          closestDate.toDateString()
      );

      sessionTimes = sessionsOnClosestDate.map((session) =>
        new Date(session.dateTime).toLocaleTimeString("uk-UA", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }
  }

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${posterPath})`,
        }}
      />

      <div className="relative z-10 flex justify-between items-end h-full px-8 py-12">
        <div className="max-w-3xl">
          <h1 className="text-6xl font-bold mb-4">{title}</h1>
          <p className="text-lg mb-6 opacity-80">{description}</p>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black py-4 px-6 rounded-full transition font-bold text-xl flex items-center gap-2">
            <IoTicket style={{ width: "30px", height: "30px" }} />
            Select sessions
          </button>
        </div>
        <div className="flex flex-col gap-4 max-w-[340px] items-end">
          <div className="flex items-center gap-6 mt-6 justify-end">
            {sessionLabel ? (
              <div className="mt-6 flex flex-col gap-2 text-sm opacity-80 ">
                <span className="font-semibold text-xl">{sessionLabel}</span>
                <div className="flex flex-wrap gap-2 justify-end">
                  {sessionTimes.map((time, idx) => (
                    <span
                      key={idx}
                      className="border border-gray-400 rounded-full px-3 py-1"
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-6 text-sm opacity-50">
                No sessions available at the moment
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-4 text-md opacity-80 justify-end">
            <span>{imdb.toFixed(1)} IMDB</span>•<span>{year}</span>•
            <span>{genre}</span>•<span>{duration} min.</span>
            <span>2D</span>•<span>Cinetech+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
