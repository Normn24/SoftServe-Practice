import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNewMovies } from "../../store/newMovie";
import { RootState, AppDispatch } from "../../store/store";
import NewMovieCard from "../NewMovieCard";
import { StatusEnum } from "../../utils/EnumsFile";
import Loader from "../Loader";

const NewMovies: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { moviesUpComming, status } = useSelector(
    (state: RootState) => state.moviesUpComming
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await dispatch(fetchNewMovies());
      setLoading(false);
    })();
  }, [dispatch]);

  if (
    !moviesUpComming ||
    moviesUpComming.length === 0 ||
    status === StatusEnum.LOADING
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <Loader />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center pt-24"
      style={{
        backgroundImage:
          "radial-gradient(black 55%, #0000), linear-gradient(135deg, deeppink, indigo, blue, cyan, lime, yellow, orange, red)",
        backgroundSize: "100% 0.5%, contain",
        backgroundRepeat: "repeat-y",
      }}
    >
      <div className="grid grid-cols-4 gap-6 p-6 w-full max-w-[1400px]">
        {moviesUpComming.map((movie) => (
          <NewMovieCard
            key={movie.movieId}
            movieId={movie.movieId}
            title={movie.tmdbDetails?.title || "N/A"}
            description={movie.tmdbDetails?.overview || ""}
            posterPath={movie.tmdbDetails?.poster_path}
          />
        ))}
      </div>

      {loading && (
        <div className="w-full flex justify-center py-8">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default NewMovies;
