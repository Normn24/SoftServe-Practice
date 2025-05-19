import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useParams } from "react-router-dom";
import { ActorsSection } from "../components/MovieComponents/ActorsSection";
import { BackdropSection } from "../components/MovieComponents/BackdropSection";
import { MovieDetailsSection } from "../components/MovieComponents/MovieDetailsSection";
import { TrailerSection } from "../components/MovieComponents/TrailerSection";
import { fetchMovie } from "../store/movieSlice";
import { AppDispatch, RootState } from "../store/store";

const MoviePage: React.FC = () => {
  const { movieId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { movie, loading, error } = useSelector(
    (state: RootState) => state.movie
  );
  useEffect(() => {
    if (movieId) dispatch(fetchMovie(+movieId));
  }, [movieId, dispatch]);
  const obj = movie;

  return obj ? (
    <div className="h-screen">
      <BackdropSection
        backdrop_path={obj.backdrop_path}
        title={obj.title}
        original_title={obj.original_title}
        overview={obj.overview}
        release_date={obj.release_date}
      />
      <MovieDetailsSection
        genres={obj.genres}
        origin_country={obj.origin_country}
        overview={obj.overview}
        poster_path={obj.poster_path}
        production_companies={obj.production_companies}
        release_date={obj.release_date}
        runtime={obj.runtime}
        spoken_languages={obj.spoken_languages}
      />
      <TrailerSection videoKey={obj.videos} />
      <ActorsSection cast={obj.cast} />
    </div>
  ) : (
    <div>Fetch failed</div>
  );
};

export default MoviePage;
