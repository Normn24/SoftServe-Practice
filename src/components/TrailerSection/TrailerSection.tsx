import { FC, useEffect, useState } from "react";
import { LazyReactPlayer } from "../LazyReactPlayer";

interface Video {
  key: string;
  type: string;
  site: string;
}

interface TrailerSectionProps {
  videos: Video[];
}

export const TrailerSection: FC<TrailerSectionProps> = ({ videos }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div className="max-w-[80rem] w-full m-auto mb-14 mt-6">
      <h2 className="text-3xl mb-6 font-bold">Film promotion</h2>
      <div className="flex gap-6">
        {videos?.map((video, idx) => (
          <div
            key={video.key}
            className="relative max-h-[230px] flex grow shrink-0 basis-0 cursor-pointer"
            onClick={() => {
              setSelectedIndex(idx);
              setIsOpen(true);
            }}
          >
            <img
              src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
              alt={`Trailer ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="relative w-20 h-20 group">
                <svg
                  height="80px"
                  width="80px"
                  viewBox="0 0 60 60"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute z-30 fill-white transition-all duration-500 group-hover:fill-black group-hover:scale-110"
                >
                  <g><path d="M45.563 29.174 L22 15 L23 46 Z" /></g>
                </svg>
                <div className="absolute z-26 w-full h-full inset-0 bg-white opacity-0 transition-all rounded-full duration-500 group-hover:opacity-100 group-hover:scale-110" />
                <svg
                  height="80px"
                  width="80px"
                  viewBox="0 0 60 60"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute z-25 fill-white transition-all duration-500 group-hover:scale-110"
                >
                  <g>
                    <path d="M30,0C13.458,0,0,13.458,0,30s13.458,30,30,30s30-13.458,30-30S46.542,0,30,0z M30,58C14.561,58,2,45.439,2,30 S14.561,2,30,2s28,12.561,28,28S45.439,58,30,58z" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isOpen && videos[selectedIndex] && (
        <div className="fixed inset-0 z-50 bg-black w-full h-full">
          <div className="w-full h-full relative flex flex-col items-center m-auto">
            <LazyReactPlayer
              src={`https://www.youtube.com/watch?v=${videos[selectedIndex].key}`}
              playing
              controls
              loop
              muted
              width="100%"
              height="100%"
            />
            <div className="absolute top-[50%] left-3 z-52 translate-y-[-50%] flex flex-col gap-4 justify-center">
              {videos?.map((video, idx) => (
                <button
                  key={video.key}
                  onClick={() => setSelectedIndex(idx)}
                  className={`px-4 py-2 rounded-lg transition border-1 border-transparent ${
                    idx === selectedIndex
                      ? "bg-yellow-500/70 border-inherit hover:border-yellow-500"
                      : "backdrop-blur-sm rounded-full bg-white/20 hover:bg-gray-100/30 hover:border-yellow-500"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2.5 left-2 text-white transition duration-200 w-12 h-12 backdrop-blur-sm rounded-full bg-white/15 flex items-center justify-center hover:bg-gray-100/30 hover:border-1 hover:border-yellow-500"
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transform rotate-180"
              >
                <path
                  d="M13.5 27L22.5 18L13.5 9"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};