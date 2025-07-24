import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import _throttle from "lodash/throttle";
import { fetchMovies } from "../../store/movieInCinema";
import { RootState, AppDispatch } from "../../store/store";
import MovieCard from "../../components/MovieCard";
import SliderCounter from "../../components/SliderCounter";
import { StatusEnum } from "../../utils/EnumsFile";
import Loader from "../Loader";
import { fetchAllMovies } from "../../store/allMovies";

const MainSlider: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeIndex, setActiveIndex] = useState(() => {
    const saved = localStorage.getItem("activeSlideIndex");
    return saved ? Number(saved) : 0;
  });
  const { movieInCinema, status } = useSelector(
    (state: RootState) => state.movieInCinema
  );

  useEffect(() => {
    dispatch(fetchMovies());
    dispatch(fetchAllMovies());
  }, [dispatch]);

  useEffect(() => {
    const handleSaveActiveIndex = () => {
      localStorage.setItem("activeSlideIndex", String(activeIndex));
    };
    window.addEventListener("beforeunload", handleSaveActiveIndex);
    return () => {
      handleSaveActiveIndex();
      window.removeEventListener("beforeunload", handleSaveActiveIndex);
    };
  }, [activeIndex]);

  const changeSlide = useCallback(
    (direction: "up" | "down") => {
      if (!movieInCinema || movieInCinema.length === 0) return;

      setActiveIndex((prevIndex) => {
        let newIndex;
        if (direction === "up") {
          newIndex = Math.max(0, prevIndex - 1);
        } else {
          newIndex = Math.min(movieInCinema.length - 1, prevIndex + 1);
        }
        return newIndex;
      });
    },
    [movieInCinema]
  );

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (event.deltaY < 0) {
        changeSlide("up");
      } else if (event.deltaY > 0) {
        changeSlide("down");
      }
    },
    [changeSlide]
  );

  const throttledWheelHandler = useMemo(
    () => _throttle(handleWheel, 600, { leading: true, trailing: false }),
    [handleWheel]
  );

  useEffect(() => {
    const sliderElement = document.getElementById("main-slider-container");
    if (sliderElement) {
      sliderElement.addEventListener("wheel", throttledWheelHandler);
    }
    return () => {
      if (sliderElement) {
        sliderElement.removeEventListener("wheel", throttledWheelHandler);
      }
      throttledWheelHandler.cancel();
    };
  }, [throttledWheelHandler]);

  if (
    !movieInCinema ||
    movieInCinema.length === 0 ||
    status === StatusEnum.LOADING
  )
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <Loader />
      </div>
    );

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
              className={`
                absolute inset-0 w-full h-full
                transition-opacity duration-700 ease-in-out
                ${
                  isActive
                    ? "opacity-100 z-10"
                    : "opacity-0 z-0 pointer-events-none"
                }
              `}
              role="tabpanel"
              aria-hidden={!isActive}
              id={`slide-${index}`}
              aria-labelledby={`slide-tab-${index}`}
            >
              <div className="w-full h-full flex items-center justify-center">
                <MovieCard
                  movieId={String(movie.movieId)}
                  title={movie.tmdbDetails?.title || "N/A"}
                  description={movie.tmdbDetails?.overview || ""}
                  posterPath={movie.tmdbDetails?.backdrop_path}
                  imdb={movie.tmdbDetails?.vote_average}
                  year={movie.tmdbDetails?.release_date?.split("-")[0] || ""}
                  genre={movie.tmdbDetails?.genres?.[0]?.name || ""}
                  duration={movie.tmdbDetails?.runtime}
                  sessions={movie.sessions || []}
                  videos={movie.tmdbDetails?.videos[1] || null}
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
