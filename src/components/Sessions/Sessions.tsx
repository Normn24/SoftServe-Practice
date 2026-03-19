import Spinner from "../Spinner/Spinner";
import SessionCard from "../Card/SessionCard";
import { useGetAllMoviesQuery } from "../../services/moviesApi";

export default function Sessions() {
  const { data: movies = [], isLoading, refetch } = useGetAllMoviesQuery();

  return (
    <div className="p-9">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Sessions
        </h1>
        <button
          className="btn bg-yellow-400 btn-md rounded-lg text-black"
          onClick={refetch}
        >
          Reload
        </button>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        movies.map((movie) => (
          <SessionCard
            key={movie.movieId}
            movieId={movie}
            reloadMovies={refetch}
          />
        ))
      )}
    </div>
  );
}