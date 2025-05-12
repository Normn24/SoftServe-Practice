import { FC } from "react";

interface Props {
  backdrop_path: string;
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
}
export const BackdropSection: FC<Props> = ({
  backdrop_path,
  title,
  original_title,
  overview,
  release_date,
}) => {
  return (
    <div
      style={{
        background: `linear-gradient(to top, rgba(0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 50%), url(${backdrop_path})`,
        backgroundSize: "cover",
      }}
      className="w-full h-10/12 relative"
    >
      <div className="h-1/3 max-w-5/12 absolute bottom-1/12 left-[5%] flex flex-col justify-end gap-3">
        <h1>{title}</h1>
        <p>{original_title}</p>
        <p>{overview}</p>
      </div>
      <div className="absolute bottom-1/12 right-0 m-5">
        <p style={{}} className="">
          First release: {release_date}
        </p>
      </div>
    </div>
  );
};
