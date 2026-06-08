import { FC } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Actor } from "../../types/movieTypes";
import { ActorCard } from "./ActorCard";

interface Props {
  cast: Actor[];
}

export const ActorsSection: FC<Props> = ({ cast }) => {
  return (
    <div className="max-w-[80rem] w-full m-auto mt-10 mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-3xl font-bold">Film cast</h2>{" "}
        <div className="flex gap-3">
          <button
            className="swiper-button-prev-custom text-white transition duration-200 w-10 h-10 backdrop-blur-sm rounded-full bg-white/15 flex items-center justify-center hover:bg-gray-100/30 hover:border hover:border-yellow-500"
            aria-label="Previous slide"
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
            className="swiper-button-next-custom text-white transition duration-200 w-10 h-10 backdrop-blur-sm rounded-full bg-white/15 flex items-center justify-center hover:bg-gray-100/30 hover:border hover:border-yellow-500"
            aria-label="Next slide"
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
        slidesPerView={2}
        navigation={{
          prevEl: ".swiper-button-prev-custom",
          nextEl: ".swiper-button-next-custom",
          disabledClass: "opacity-40 cursor-not-allowed",
        }}
        breakpoints={{
          640: {
            slidesPerView: 3,
            spaceBetween: 20,
          },

          768: {
            slidesPerView: 4,
            spaceBetween: 25,
          },

          1024: {
            slidesPerView: 5,
            spaceBetween: 30,
          },

          1280: {
            slidesPerView: 6,
            spaceBetween: 30,
          },
        }}
      >
        {cast.map((actor) => (
          <SwiperSlide key={actor.original_name}>
            <ActorCard
              name={actor.name}
              original_name={actor.original_name}
              profile_path={
                actor.profile_path
                  ? `https://image.tmdb.org/t/p/original/${actor.profile_path}`
                  : "/actor-blank.png"
              }
              character={actor.character}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
