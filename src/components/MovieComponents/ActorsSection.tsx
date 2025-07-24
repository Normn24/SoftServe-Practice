import { FC, useRef } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Actor } from "../../types/movieTypes";
import { ActorCard } from "./ActorCard";
interface Props {
  cast: Actor[];
}

export const ActorsSection: FC<Props> = ({ cast }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  return (
    <div className="max-w-[80rem] m-auto mb-10">
      <div className="flex justify-between mb-6">
        <h2 className="text-3xl font-bold">Film cast</h2>
        <div className="flex gap-2 ">
          <button
            ref={prevRef}
            className="text-white transition duration-200 w-10 h-10 backdrop-blur-sm rounded-full bg-white/15 flex items-center justify-center hover:bg-gray-100/30 hover:border-1 hover:border-yellow-500"
          >
            <svg
              width="28"
              height="28"
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
          <button
            ref={nextRef}
            className="text-white transition duration-200 w-10 h-10 backdrop-blur-sm rounded-full bg-white/15 flex items-center justify-center hover:bg-gray-100/30 hover:border-1 hover:border-yellow-500"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
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

      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={6}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
      >
        <div>
          {cast.map((actor, index) => (
            <SwiperSlide key={index}>
              <ActorCard
                name={actor.name}
                original_name={actor.original_name}
                profile_path={
                  actor.profile_path !== null
                    ? `https://image.tmdb.org/t/p/original//${actor.profile_path}`
                    : "/actor-blank.png"
                }
                character={actor.character}
              />
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
    </div>
  );
};
