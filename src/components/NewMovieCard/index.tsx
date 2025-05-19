import React from "react";

interface NewMovieCardProps {
  movieId: number;
  title: string;
  description: string;
  posterPath: string;
}

const NewMovieCard: React.FC<NewMovieCardProps> = ({
  title,
  description,
  posterPath,
}) => {
  return (
    <div className="relative w-[270px] h-[400px] text-white text-center overflow-hidden transition-all duration-500 ease-in-out rounded-lg group">
      <div
        className="w-full h-[400px] bg-cover bg-center transition-all duration-500 ease-in-out transform group-hover:scale-110 group-hover:filter group-hover:blur-[7px] group-hover:bg-black group-hover:bg-opacity-70"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${posterPath})`,
        }}
      />
      <div className="absolute bottom-0 left-0 w-full h-[270px] flex flex-col justify-center items-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-sm font-bold mb-2 line-clamp-3">{title}</p>
        <p className="text-xs leading-[18px] opacity-80 line-clamp-8">
          {description}
        </p>
      </div>
    </div>
  );
};

export default NewMovieCard;
