import { FC, useState } from "react";
import YouTube from "react-youtube";

interface Props {
  videoKey: string;
}

export const TrailerSection: FC<Props> = ({ videoKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="max-w-[90rem] m-auto mb-10">
      <h2 className="text-3xl mb-4">Trailer</h2>
      <div
        className="relative w-[400px] h-[300px]"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <img
          src={`https://img.youtube.com/vi/${videoKey}/hqdefault.jpg`}
          className=""
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="relative w-20 h-20 group">
            <svg
              height="80px"
              width="80px"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 60 60"
              className="absolute z-30 fill-white transition-all duration-500 group-hover:fill-black group-hover:scale-110"
            >
              <g>
                <path d="M45.563 29.174 L22 15 L23 46 Z" />
              </g>
            </svg>
            <div className="absolute z-26 w-full h-full inset-0 bg-white opacity-0 transition-all rounded-full duration-500 group-hover:opacity-100 group-hover:scale-110"></div>
            <svg
              height="80px"
              width="80px"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 60 60"
              className="absolute z-25 fill-white transition-all duration-500 group-hover:fill-white group-hover:scale-110"
            >
              <g>
                <path
                  d="M30,0C13.458,0,0,13.458,0,30s13.458,30,30,30s30-13.458,30-30S46.542,0,30,0z M30,58C14.561,58,2,45.439,2,30
		S14.561,2,30,2s28,12.561,28,28S45.439,58,30,58z"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 w-full h-full flex items-center justify-center p-4">
          <div className=" w-full max-w-6xl h-[90vh]">
            <YouTube
              videoId={videoKey}
              opts={{
                width: "100%",
                height: "100%",
                playerVars: {
                  autoplay: 1,
                },
              }}
              className="w-full h-full"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="absolute flex bg-blue-800/25 py-2 px-5 rounded-3xl top-5 left-5 text-white text-2xl hover:border-b hover:border-white"
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className=" transform rotate-180"
              >
                <path
                  d="M13.5 27L22.5 18L13.5 9"
                  stroke="#fff"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <p>Back to movie details</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
