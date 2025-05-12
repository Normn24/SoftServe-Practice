import { FC } from "react";
import { Actor } from "../../types/movieTypes";

export const ActorCard: FC<Actor> = ({
  //   adult,
  //   gender,
  //   known_for_department,
  name,
  original_name,
  //   popularity,
  profile_path,
  character,
}) => {
  return (
    <div className="flex flex-col items-center w-[250px]">
      <img
        src={profile_path}
        alt={original_name}
        className="w-[240px] h-[320px]"
      />
      <p className="text-[18px] text-white pt-3">{name}</p>
      <p className="text-[14px] text-gray-400">{character}</p>
    </div>
  );
};
