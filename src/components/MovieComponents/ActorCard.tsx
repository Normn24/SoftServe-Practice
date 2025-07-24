import { FC } from "react";
import { Actor } from "../../types/movieTypes";

export const ActorCard: FC<Actor> = ({
  name,
  original_name,
  profile_path,
  character,
}) => {
  return (
    <div className="flex flex-col items-start w-[205px] cursor-grab">
      <img
        src={profile_path}
        alt={original_name}
        className="h-[310px] object-cover"
      />
      <p className="text-[20px] text-white pt-3">{name}</p>
      <p className="text-[16px] text-gray-400">{character}</p>
    </div>
  );
};
