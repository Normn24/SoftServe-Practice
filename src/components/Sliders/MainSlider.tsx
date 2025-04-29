import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import _debounce from "lodash/debounce";
import { fetchMovies } from "../../store/movieInCinema";
import { RootState, AppDispatch } from "../../store/store";
import MovieCard from "../../components/MovieCard";
import SliderCounter from "../../components/SliderCounter";

const MainSlider: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { movieInCinema } = useSelector(
    (state: RootState) => state.movieInCinema
  );

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  const handleScrollRequest = useCallback(
    (direction: "up" | "down") => {
      if (
        !containerRef.current ||
        isScrolling.current ||
        !movieInCinema ||
        movieInCinema.length === 0
      )
        return;

      const containerHeight = containerRef.current.clientHeight;
      const newIndex =
        direction === "up"
          ? Math.max(0, activeIndex - 1)
          : Math.min(movieInCinema.length - 1, activeIndex + 1);

      if (newIndex !== activeIndex) {
        isScrolling.current = true;
        const targetScrollTop = containerHeight * newIndex;
        containerRef.current.scrollTo({
          top: targetScrollTop,
          behavior: "smooth",
        });

        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
          isScrolling.current = false;
          const currentScroll = containerRef.current?.scrollTop ?? 0;
          const calculatedIndex = Math.round(currentScroll / containerHeight);
          if (calculatedIndex !== activeIndex) {
            setActiveIndex(
              Math.max(0, Math.min(movieInCinema.length - 1, calculatedIndex))
            );
          }
        }, 150);
      }
    },
    [activeIndex, movieInCinema]
  );

  useEffect(() => {
    const handleDebouncedScroll = _debounce(() => {
      const container = containerRef.current;
      if (container && !isScrolling.current && movieInCinema?.length > 0) {
        const { scrollTop, clientHeight } = container;
        const currentIndex = Math.round(scrollTop / clientHeight);
        const validIndex = Math.max(
          0,
          Math.min(movieInCinema.length - 1, currentIndex)
        );
        if (validIndex !== activeIndex) {
          setActiveIndex(validIndex);
        }
      }
    }, 150);

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleDebouncedScroll, {
        passive: true,
      });
    }

    return () => {
      container?.removeEventListener("scroll", handleDebouncedScroll);
      handleDebouncedScroll.cancel();
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [activeIndex, movieInCinema]);

  if (!movieInCinema || movieInCinema.length === 0)
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Фільмів немає.
      </div>
    );

  return (
    <div className="relative h-screen overflow-hidden bg-black">
      <div
        ref={containerRef}
        className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide "
      >
        {movieInCinema.map((movie, index) => (
          <div
            key={movie.movieId || `movie-${index}`}
            className="snap-start h-screen w-full flex items-center justify-center "
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} з ${movieInCinema.length}`}
          >
            <MovieCard
              movieId={movie.movieId}
              title={movie.tmdbDetails?.title || "N/A"}
              description={movie.tmdbDetails?.overview || ""}
              posterPath={movie.tmdbDetails?.poster_path}
              imdb={movie.tmdbDetails?.vote_average}
              year={movie.tmdbDetails?.release_date?.split("-")[0] || ""}
              genre={movie.tmdbDetails?.genres?.[0]?.name || ""}
              duration={movie.tmdbDetails?.runtime}
              sessions={movie.sessions || []}
              videos={movie.tmdbDetails.videos || null}
              isActive={index === activeIndex}
            />
          </div>
        ))}
      </div>

      <SliderCounter
        currentIndex={activeIndex}
        totalCount={movieInCinema.length}
        onScroll={handleScrollRequest}
      />
    </div>
  );
};
export default MainSlider;
