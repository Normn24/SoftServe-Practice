import { FC } from "react";
import { Genre, ProductionCompany } from "../../types/movieTypes";
import { GenreItem } from "./GenreItem";
import { MovieDetailItem } from "./MovieDetailItem";

interface Props {
  genres: Genre[];
  origin_country: string[];
  overview: string;
  poster_path: string;
  production_companies: ProductionCompany[];
  release_date: string;
  runtime: number;
  spoken_languages: string[];
}

export const MovieDetailsSection: FC<Props> = ({
  genres,
  origin_country,
  overview,
  poster_path,
  production_companies,
  release_date,
  runtime,
  spoken_languages,
}) => {
  return (
    <div className="max-w-[90rem] m-auto flex p-10 justify-center gap-14">
      <div className="flex-[30%] flex justify-center ">
        <img
          src={`https://image.tmdb.org/t/p/original${poster_path}`}
          alt="Poster image"
          className="w-full h-[32.5rem]"
        ></img>
      </div>

      <div className="flex-[40%] flex flex-col gap-7">
        <h2 className="text-3xl font-bold">Genres</h2>
        <div className="flex gap-3">
          {genres.map((genre, i) => (
            <GenreItem genre={genre.name} key={i} />
          ))}
        </div>
        <hr className="mt-4 mb-4" />

        <h2 className="text-3xl font-bold">Short overview</h2>
        <p className="text-[18px]">
          {overview}
          {overview}
        </p>
        <hr className="mt-4 mb-4" />

        <h2 className="text-3xl font-bold">Production Companies</h2>
        <div className="flex flex-wrap gap-5 justify-center">
          {production_companies.slice(0, 3).map((company) => (
            <div
              className="flex flex-col gap-2 items-center w-[149px] text-center"
              key={company.id}
            >
              <img
                src={`https://image.tmdb.org/t/p/original${company.logo_path}`}
                className="w-[90px] h-[90px] rounded-full object-contain border-1 bg-white"
              ></img>
              <p>{company.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-[30%] flex-col ">
        <MovieDetailItem title="Languages" value={spoken_languages} />
        <MovieDetailItem title="Country of origin" value={origin_country} />
        <MovieDetailItem title="Release date" value={release_date} />
        <MovieDetailItem title="Movie duration" value={runtime} />
      </div>
    </div>
  );
};
