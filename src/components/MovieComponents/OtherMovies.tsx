import React, { useEffect, useMemo, useState } from "react";
import ReactPlayer from "react-player";
import { NavLink } from "react-router-dom";
import { useGetMoviesInCinemaQuery } from "../../services/moviesApi";
import { Movie } from "../../types/authTypes";

interface OtherMoviesProps {
  movieId: number;
}

const OtherMovies: React.FC<OtherMoviesProps> = ({ movieId }) => {
  const { data: movieInCinema = [] } = useGetMoviesInCinemaQuery();
  const [showTrailer, setShowTrailer] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const otherMovies = useMemo<Movie[]>(() => {
    if (movieInCinema.length <= 1) return [];
    const filtered = movieInCinema.filter((m) => +m.movieId !== movieId);
    if (filtered.length === 0) return [];
    const maxStartIndex = Math.max(0, filtered.length - 2);
    const startIndex = Math.floor(Math.random() * (maxStartIndex + 1));
    return filtered.slice(startIndex, startIndex + 2);
  }, [movieInCinema, movieId]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (hoveredIdx !== null) {
      timer = setTimeout(() => setShowTrailer(true), 500);
    } else {
      setShowTrailer(false);
    }
    return () => clearTimeout(timer);
  }, [hoveredIdx]);

  if (otherMovies.length === 0) return null;

  return (
    <div className="relative h-full">
      <div className="max-w-[80rem] w-full mx-auto">
        <h2 className="text-3xl mb-6 font-bold">More films</h2>
        <div className="flex gap-8">
          {otherMovies.map((film, idx) => {
            const trailer = film.tmdbDetails.videos[0];
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={film._id}
                className="relative flex h-90 overflow-hidden w-1/2 opacity-90 group cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <NavLink to={`/movies/${film.movieId}`}>
                  <div
                    style={{
                      backgroundImage: `url(https://image.tmdb.org/t/p/original${film.tmdbDetails.poster_path})`,
                    }}
                    className="absolute w-full h-90 bg-contain bg-left bg-no-repeat z-1 transition-all duration-500"
                  />
                  <div className="absolute right-0 h-full w-[70%] blur-[25px] z-1">
                    <div
                      className="absolute hidden sm:block h-full bg-cover bg-center scale-200 blur-[20px] right-0 w-[70%]"
                      style={{
                        backgroundImage: `url(https://image.tmdb.org/t/p/original${film.tmdbDetails.poster_path})`,
                      }}
                    />
                  </div>

                  {isHovered && showTrailer && trailer && (
                    <div className="absolute inset-0 z-1">
                      <ReactPlayer
                        src={`https://www.youtube.com/watch?v=${trailer.key}`}
                        playing
                        muted
                        loop
                        controls={false}
                        width="100%"
                        height="100%"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          objectFit: "cover",
                          pointerEvents: "none",
                        }}
                      />
                    </div>
                  )}

                  <div
                    className={`absolute sm:h-full w-[70%] right-0 sm:top-0 sm:bottom-auto bottom-0 sm:pl-12 sm:py-4 p-8 z-2 flex flex-col justify-end transition duration-1000 ease-in-out ${
                      isHovered ? "-translate-x-53" : ""
                    }`}
                  >
                    <div
                      className={`uppercase font-cervo sm:font-bold mb-2 font-normal sm:mb-3 text-4xl w-full transition-all duration-300 text-shadow-[2px_5px_10px_rgba(0,0,0,1)] ${
                        isHovered ? "text-white text-[24px]" : ""
                      }`}
                    >
                      {film.tmdbDetails.title}
                    </div>

                    {!isHovered && (
                      <div className="flex flex-col gap-1 items-start text-white">
                        <div className="flex flex-wrap gap-2 text-md opacity-80 justify-end">
                          <span>
                            {film.tmdbDetails.vote_average.toFixed(1)} IMDB
                          </span>
                          •
                          <span>
                            {film.tmdbDetails.release_date.split("-")[0]}
                          </span>
                          •<span>{film.tmdbDetails.genres[1]?.name}</span>•
                          <span>{film.tmdbDetails.runtime} min</span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-md opacity-80">
                          <span>2D</span>•<span>Cinetech+</span>
                        </div>
                      </div>
                    )}
                  </div>
                </NavLink>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OtherMovies;