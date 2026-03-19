import Card from "../Card/Card";
import Spinner from "../Spinner/Spinner";
import { useGetAllMoviesQuery } from "../../services/moviesApi";

export default function Movies() {
  const { data: movies = [], isLoading } = useGetAllMoviesQuery();

  return (
    <div className="p-9 pt-30">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Movies List
        </h1>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="flex flex-wrap gap-5 justify-start mt-5">
          {movies.map((movie) => (
            <Card key={movie.movieId} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}