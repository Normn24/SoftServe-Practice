import React, { useEffect, useCallback, useRef } from "react";
import _throttle from "lodash/throttle";
import { useGetMoviesInCinemaQuery } from "../../services/moviesApi";
import MovieCard from "../../components/MovieCard";
import SliderCounter from "../../components/SliderCounter";
import Loader from "../Loader";
import { usePersistedState } from "../../hooks/usePersistedState";

const SLIDE_KEY = "activeSlideIndex";
const THROTTLE_MS = 600;

const MainSlider: React.FC = () => {
  const { data: movieInCinema = [], isLoading } = useGetMoviesInCinemaQuery();
  const [activeIndex, setActiveIndex] = usePersistedState<number>(SLIDE_KEY, 0);

  const changeSlide = useCallback(
    (direction: "up" | "down") => {
      if (movieInCinema.length === 0) return;
      setActiveIndex((prev) => {
        if (direction === "up") return Math.max(0, prev - 1);
        return Math.min(movieInCinema.length - 1, prev + 1);
      });
    },
    [movieInCinema.length, setActiveIndex]
  );

  const throttledChangeSlideRef = useRef(
    _throttle(changeSlide, THROTTLE_MS, { leading: true, trailing: false })
  );

  useEffect(() => {
    throttledChangeSlideRef.current = _throttle(
      changeSlide,
      THROTTLE_MS,
      { leading: true, trailing: false }
    );
  }, [changeSlide]);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      throttledChangeSlideRef.current(event.deltaY < 0 ? "up" : "down");
    };

    const sliderElement = document.getElementById("main-slider-container");
    sliderElement?.addEventListener("wheel", handleWheel);

    return () => {
      sliderElement?.removeEventListener("wheel", handleWheel);
      throttledChangeSlideRef.current.cancel();
    };
  }, []);

  if (isLoading || movieInCinema.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <Loader />
      </div>
    );
  }

  return (
    <div
      id="main-slider-container"
      className="relative h-screen overflow-hidden bg-black"
    >
      <div className="relative w-full h-full">
        {movieInCinema.map((movie, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={movie._id || movie.movieId || `movie-${index}`}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isActive
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
              role="tabpanel"
              aria-hidden={!isActive}
              id={`slide-${index}`}
              aria-labelledby={`slide-tab-${index}`}
            >
              <div className="w-full h-full flex items-center justify-center">
                <MovieCard
                  movieId={String(movie.movieId)}
                  title={movie.tmdbDetails?.title ?? "N/A"}
                  description={movie.tmdbDetails?.overview ?? ""}
                  posterPath={movie.tmdbDetails?.backdrop_path}
                  imdb={movie.tmdbDetails?.vote_average}
                  year={movie.tmdbDetails?.release_date?.split("-")[0] ?? ""}
                  genre={movie.tmdbDetails?.genres?.[0]?.name ?? ""}
                  duration={movie.tmdbDetails?.runtime}
                  sessions={movie.sessions ?? []}
                  videos={movie.tmdbDetails?.videos[1] ?? null}
                  isActive={isActive}
                />
              </div>
            </div>
          );
        })}
      </div>
      <SliderCounter
        currentIndex={activeIndex}
        totalCount={movieInCinema.length}
        onScroll={changeSlide}
      />
    </div>
  );
};

export default MainSlider;