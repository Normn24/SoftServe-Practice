import React, { useEffect, useState } from "react";
import { Session } from "../../types/authTypes";
import { IoTicket } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { RoutePaths } from "../../utils/EnumsFile";
import { LazyReactPlayer } from "../LazyReactPlayer";
import { useClosestSessions } from "../../hooks/UseClosestSessions";

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
  videos: { key: string; type: string; site: string } | null;
}

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

  const closestSessionInfo = useClosestSessions(sessions);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isActive) {
      timer = setTimeout(() => setShowTrailer(true), 5000);
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
        <div className="relative z-10 flex justify-between items-end h-full px-8 py-12 bg-gradient-to-t from-[#000000] to-40% to-transparent">
          <div className="max-w-3xl">
            <h1 className="text-6xl font-bold mb-4">{title}</h1>
            <p className="text-lg mb-20 opacity-80">
              {description.split(/[.!?]/)[0]}
            </p>
          </div>
          <div className="flex flex-col gap-4 max-w-full items-end">
            <div className="flex items-center gap-6 mt-6 justify-end">
              {closestSessionInfo.label ? (
                <div className="mt-6 flex flex-col gap-2 text-sm opacity-80">
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

        {showTrailer && videos?.key ? (
          <div className="absolute inset-0 z-0 pt-[56.25%] top-[50%] translate-y-[-50%]">
            <LazyReactPlayer
              src={`https://www.youtube.com/watch?v=${videos.key}`}
              playing
              controls
              loop
              muted
              className="absolute top-0 left-0 object-fill"
              width="100%"
              height="100%"
            />
          </div>
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-70"
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