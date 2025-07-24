import { FC } from "react";

interface Props {
  backdrop_path: string;
  title: string;
  overview: string;
  imdb: number;
  year: string;
  genre: string;
  duration: number;
}
export const BackdropSection: FC<Props> = ({
  backdrop_path,
  title,
  overview,
  imdb,
  year,
  genre,
  duration,
}) => {
  return (
    <div className="w-full h-[740px] relative z-10">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70 "
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${backdrop_path})`,
        }}
      />

      <div className="w-full absolute bottom-0 p-8 flex justify-between items-end">
        <div className="flex flex-col justify-end gap-3">
          <h1 className="text-6xl font-bold text-white">{title}</h1>
          <p className="text-lg opacity-80 text-white font-medium">
            {overview}
          </p>
        </div>
        <div className="flex flex-col gap-4 items-end text-white">
          <div className="flex flex-wrap gap-4 text-md opacity-80 justify-end">
            <span>{imdb.toFixed(1)} IMDB</span>•<span>{year}</span>•
            <span>{genre}</span>•<span>{duration} min</span>
          </div>
          <div className="flex flex-wrap gap-4 text-md opacity-80 justify-end">
            <span>2D</span>•<span>Cinetech+</span>
          </div>
        </div>
      </div>
    </div>
  );
};
