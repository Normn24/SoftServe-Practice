import { FC } from "react";
import { Genre, ProductionCompanies } from "../../types/movieTypes";
import { GenreItem } from "./GenreItem";
import { MovieDetailItem } from "./MovieDetailItem";

interface Props {
  genres: Genre[];
  origin_country: string[];
  overview: string;
  poster_path: string;
  production_companies: ProductionCompanies[];
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
    <div className="max-w-[90rem] m-auto flex p-10 justify-center">
      <div className="flex-[30%] flex justify-center ">
        <img
          src={poster_path}
          alt="Poster image"
          className="w-[15rem] h-[22.5rem]"
        ></img>
      </div>

      <div className="flex-[40%] flex flex-col px-[5rem] gap-7">
        <h2 className="text-3xl">Genres</h2>
        <div className="flex gap-3">
          {genres.map((genre, i) => (
            <GenreItem genre={genre.name} key={i} />
          ))}
        </div>

        <h2 className="text-3xl">Short overview</h2>
        <p className="text-[18px]">{overview}</p>
        <h2 className="text-3xl">Production Companies</h2>
        <div className="flex flex-wrap gap-5">
          {production_companies.map((company) => (
            <div className="flex flex-col gap-2 items-center" key={company.id}>
              <img
                src={company.logo_path}
                className="w-[80px] h-[80px] rounded-[50%]"
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
