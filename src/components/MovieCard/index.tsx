import React, { useEffect, useMemo, useState } from "react";
import { Session } from "../../types/authTypes";
import { IoTicket } from "react-icons/io5";
// import YouTube from "react-youtube";
import ReactPlayer from "react-player";
import { NavLink } from "react-router-dom";
import { RoutePaths } from "../../utils/EnumsFile";

interface MovieCardProps {
  movieId: string;
  title: string;
  description: string;
  posterPath: string;
  imdb: number;
  year: string;
  genre: string;
  duration: number;
  sessions: Session[];
  isActive: boolean;
  videos: { key: string; type: string; site: string };
}

const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const MovieCard: React.FC<MovieCardProps> = ({
  movieId,
  title,
  description,
  posterPath,
  imdb,
  year,
  genre,
  duration,
  sessions,
  isActive,
  videos,
}) => {
  const [showTrailer, setShowTrailer] = useState(false);
  const closestSessionInfo = useMemo(() => {
    if (!sessions || sessions.length === 0) {
      return { label: "", times: [], dateString: null };
    }

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const todayDateString = today.toDateString();
    const tomorrowDateString = tomorrow.toDateString();

    const todaySessions = sessions.filter(
      (session) => new Date(session.dateTime).toDateString() === todayDateString
    );
    if (todaySessions.length > 0) {
      return {
        label: "Sessions today:",
        times: todaySessions.map((session) =>
          new Date(session.dateTime).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })
        ),
        dateString: formatDateToYYYYMMDD(today),
      };
    }

    const tomorrowSessions = sessions.filter(
      (session) =>
        new Date(session.dateTime).toDateString() === tomorrowDateString
    );

    if (tomorrowSessions.length > 0) {
      return {
        label: "Sessions tomorrow:",
        times: tomorrowSessions.map((session) =>
          new Date(session.dateTime).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })
        ),
        dateString: formatDateToYYYYMMDD(tomorrow),
      };
    }

    const futureSessions = sessions
      .filter((session) => new Date(session.dateTime) > today)
      .sort(
        (a, b) =>
          new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
      );

    if (futureSessions.length > 0) {
      const closestDate = new Date(futureSessions[0].dateTime);
      const formattedDisplayDate = closestDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
      });

      const sessionsOnClosestDate = futureSessions.filter(
        (session) =>
          new Date(session.dateTime).toDateString() ===
          closestDate.toDateString()
      );

      return {
        label: `Sessions ${formattedDisplayDate}:`,
        times: sessionsOnClosestDate.map((session) =>
          new Date(session.dateTime).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })
        ),
        dateString: formatDateToYYYYMMDD(closestDate),
      };
    }

    return { label: "", times: [], dateString: null };
  }, [sessions]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isActive) {
      timer = setTimeout(() => {
        setShowTrailer(true);
      }, 5000);
    } else {
      setShowTrailer(false);
    }
    return () => clearTimeout(timer);
  }, [isActive]);

  const sessionsPath = RoutePaths.MOVIESESSIONS.replace(":movieId", movieId);
  const linkToSessions = closestSessionInfo.dateString
    ? `${sessionsPath}?date=${closestSessionInfo.dateString}`
    : sessionsPath;

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      <NavLink to={`movies/${movieId}`}>
        <div
          className="relative z-10 flex justify-between items-end h-full px-8 py-12 
          bg-gradient-to-t from-[#000000] to-40% to-transparent"
        >
          <div className="max-w-3xl">
            <h1 className="text-6xl font-bold mb-4">{title}</h1>
            <p className="text-lg mb-20 opacity-80">
              {description.split(/[.!?]/)[0]}
            </p>
          </div>
          <div className="flex flex-col gap-4 max-w-full items-end">
            <div className="flex items-center gap-6 mt-6 justify-end">
              {closestSessionInfo.label ? (
                <div className="mt-6 flex flex-col gap-2 text-sm opacity-80 ">
                  <span className="font-semibold text-xl text-right">
                    {closestSessionInfo.label}
                  </span>
                  <div className="flex flex-wrap gap-2 justify-end">
                    {closestSessionInfo.times.map((time, idx) => (
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
            </div>
            <div className="flex flex-wrap gap-4 text-md opacity-80 justify-end">
              <span>2D</span>•<span>Cinetech+</span>
            </div>
          </div>
        </div>
        {showTrailer && videos && typeof videos.key === "string" ? (
          <div className="absolute inset-0 z-0 pt-[56.25%] top-[50%] translate-y-[-50%]">
            <ReactPlayer
              src={`https://www.youtube.com/watch?v=${videos.key}`}
              playing
              controls={false}
              loop
              muted
              className="absolute top-0 left-0 object-fill"
              width={"100%"}
              height={"100%"}
            />
          </div>
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-70 "
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${posterPath})`,
            }}
          />
        )}
      </NavLink>

      <NavLink
        to={linkToSessions}
        className="fixed z-20 bottom-12 left-8 w-max bg-yellow-400 hover:bg-yellow-500 text-black py-4 px-6 rounded-full transition font-bold text-xl flex items-center gap-2"
      >
        <IoTicket style={{ width: "30px", height: "30px" }} />
        Select sessions
      </NavLink>
    </div>
  );
};

export default MovieCard;
