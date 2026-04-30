import { FC } from "react";
import { Genre, ProductionCompany } from "../../types/movieTypes";
import { GenreItem } from "./GenreItem";
import { MovieDetailItem } from "./MovieDetailItem";
import { MovieRatingBadge } from "./MovieRatingBadge";

interface Props {
  id: number;
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
  id,
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
    <div className="max-w-[80rem] m-auto flex pt-25 justify-center gap-14">
      <div className="flex-[30%] flex justify-center relative">
        <img
          src={`https://image.tmdb.org/t/p/original${poster_path}`}
          alt="Poster image"
          className="w-[95%] h-[31.5rem] -rotate-1 z-1"
        ></img>
        <div className="absolute w-[95%] h-[31.5rem] bg-gradient-to-t from-white/10 to-slate-700/20 backdrop-blur-md z-0 -rotate-1 -translate-y-5 translate-5"></div>
        <div className="absolute w-[95%] h-[31.5rem] bg-gradient-to-b from-white/10 to-slate-700/50  backdrop-blur-md -z-1 rotate-10 -translate-y-7 -translate-1"></div>
      </div>

      <div className="flex-[40%] flex flex-col gap-6">
        <h2 className="text-3xl font-bold leading-none">
          What is this movie like
        </h2>
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
        <div className="flex flex-wrap gap-4 justify-start">
          {production_companies.slice(0, 3).map((company) => (
            <div
              className="flex grow shrink-0 basis-0 flex-col gap-2 items-center w-auto max-w-1/3 text-center"
              key={company.id}
            >
              <img
                src={
                  company.logo_path !== null
                    ? `https://image.tmdb.org/t/p/original${company.logo_path}`
                    : "/prod-company-blank.png"
                }
                className="w-full h-[100px] rounded-lg object-contain border-1 bg-white"
              ></img>
              <p className="text-gray-400 italic">{company.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-[30%] flex-col ">
        <MovieDetailItem title="Languages" value={spoken_languages} />
        <MovieDetailItem title="Country of origin" value={origin_country} />
        <MovieDetailItem title="Release date" value={release_date} />
        <MovieDetailItem title="Movie duration" value={runtime} />
        <MovieRatingBadge movieId={id} />
      </div>
    </div>
  );
};
