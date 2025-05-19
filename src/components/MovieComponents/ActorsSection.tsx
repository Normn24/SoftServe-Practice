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
    <div className="max-w-[90rem] m-auto">
      <div className="flex justify-between pb-6">
        <h2 className="text-3xl pb-5">Film crew and cast</h2>
        <div className="flex gap-2">
          <button
            ref={prevRef}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/45  shadow hover:bg-gray-200 transition"
          >
            <img
              src="/arrow.svg"
              alt="Previous"
              className="w-5 h-5 rotate-180"
            />
          </button>
          <button
            ref={nextRef}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/45 shadow hover:bg-gray-200 transition"
          >
            <img src="/arrow.svg" alt="Next" className="w-5 h-5" />
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={1}
        slidesPerView={5.9}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onInit={(swiper) => {
          setTimeout(() => {
            if (
              prevRef.current &&
              nextRef.current &&
              swiper.params.navigation
            ) {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;

              swiper.navigation.init();
              swiper.navigation.update();
            }
          }, 0);
        }}
      >
        <div>
          {cast.map((actor, index) => (
            <SwiperSlide key={index}>
              <ActorCard
                name={actor.name}
                original_name={actor.original_name}
                profile_path={`https://image.tmdb.org/t/p/original//${actor.profile_path}`}
                character={actor.character}
              />
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
    </div>
  );
};
