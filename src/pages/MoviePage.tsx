import React from "react";
import { ActorsSection } from "../components/MovieComponents/ActorsSection";
import { BackdropSection } from "../components/MovieComponents/BackdropSection";
import { MovieDetailsSection } from "../components/MovieComponents/MovieDetailsSection";
import { TrailerSection } from "../components/MovieComponents/TrailerSection";
import { Movie } from "../types/movieTypes";

const MoviePage: React.FC = () => {
  const obj: Movie = {
    adult: false,
    backdrop_path:
      "https://movies.sterkinekor.co.za/CDN/media/entity/get/FilmTitleGraphic/HO00003393?referenceScheme=HeadOffice&allowPlaceHolder=true",
    id: 822119,
    original_language: "en",
    original_title: "Captain America: Brave New World",
    popularity: 262.1664,

    title: "Captain America: Brave New World",
    video: "https://www.youtube.com/watch?v=xvFZjo5PgG0&ab_channel=Duran",
    vote_average: 6.146,
    vote_count: 1636,
    genres: [
      { id: 88, name: "Comedy" },
      { id: 88, name: "Triller" },
      { id: 88, name: "Drama" },
    ],
    recommendations: {
      name: "Official Trailer [Subtitled]",
      key: "tlLsFEDHtWs",
    },
    origin_country: ["UK", "Ukraine"],
    overview:
      "After meeting with newly elected U.S. President Thaddeus Ross, Sam finds himself in the middle of an international incident. He must discover the reason behind a nefarious global plot before the true mastermind has the entire world seeing red.",
    poster_path:
      "https://preview.redd.it/official-poster-for-thunderbolts-v0-evhw576e5kqd1.jpeg?auto=webp&s=83070f0bd3c6384a0357baf0c48471a5410401e6",
    production_companies: [
      {
        id: 123,
        logo_path:
          "https://movies.sterkinekor.co.za/CDN/media/entity/get/FilmTitleGraphic/HO00003393?referenceScheme=HeadOffice&allowPlaceHolder=true",
        name: "FirstProdComp",
      },
      {
        id: 1234,
        logo_path:
          "https://movies.sterkinekor.co.za/CDN/media/entity/get/FilmTitleGraphic/HO00003393?referenceScheme=HeadOffice&allowPlaceHolder=true",
        name: "FirstProdComp",
      },
      {
        id: 1235,
        logo_path:
          "https://movies.sterkinekor.co.za/CDN/media/entity/get/FilmTitleGraphic/HO00003393?referenceScheme=HeadOffice&allowPlaceHolder=true",
        name: "FirstProdComp",
      },
      {
        id: 1236,
        logo_path:
          "https://movies.sterkinekor.co.za/CDN/media/entity/get/FilmTitleGraphic/HO00003393?referenceScheme=HeadOffice&allowPlaceHolder=true",
        name: "FirstProdComp",
      },
    ],
    release_date: "2025-02-12",
    runtime: 120,
    spoken_languages: ["Ukrainian", "English"],
    cast: [
      {
        adult: false,
        gender: 1,
        known_for_department: "Acting",
        name: "Jeanne Goursaud",
        original_name: "Jeanne Goursaud",
        popularity: 8.7511,
        profile_path:
          "https://cdn.planetakino.ua/person/Anthony_Hopkins/Anthony+Hopkins.jpg",
        character: "Sara",
      },
      {
        adult: false,
        gender: 1,
        known_for_department: "Acting",
        name: "Jeanne Goursaud",
        original_name: "Jeanne Goursaud",
        popularity: 8.7511,
        profile_path:
          "https://cdn.planetakino.ua/person/Anthony_Hopkins/Anthony+Hopkins.jpg",
        character: "Sara",
      },
      {
        adult: false,
        gender: 2,
        known_for_department: "Acting",
        name: "Dougray Scott",
        original_name: "Dougray Scott",
        popularity: 4.6665,
        profile_path:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTm2Z646w3yMybAVaVix_uqR1Ovczv2SKhOg&s",
        character: "Eric Kynch",
      },
      {
        adult: false,
        gender: 1,
        known_for_department: "Acting",
        name: "Lera Abova",
        original_name: "Lera Abova",
        popularity: 2.3786,
        profile_path:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTm2Z646w3yMybAVaVix_uqR1Ovczv2SKhOg&s",
        character: "Irina / Kira",
      },
      {
        adult: false,
        gender: 2,
        known_for_department: "Acting",
        name: "Emanuel Fellmer",
        original_name: "Emanuel Fellmer",
        popularity: 0.4647,
        profile_path:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTm2Z646w3yMybAVaVix_uqR1Ovczv2SKhOg&s",
        character: "Moritz Aniol",
      },
      {
        adult: false,
        gender: 1,
        known_for_department: "Acting",
        name: "Annabelle Mandeng",
        original_name: "Annabelle Mandeng",
        popularity: 0.7879,
        profile_path:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTm2Z646w3yMybAVaVix_uqR1Ovczv2SKhOg&s",
        character: "Deborah Allen",
      },
      {
        adult: false,
        gender: 1,
        known_for_department: "Acting",
        name: "Annabelle Mandeng",
        original_name: "Annabelle Mandeng",
        popularity: 0.7879,
        profile_path:
          "https://cdn.planetakino.ua/person/Anthony_Hopkins/Anthony+Hopkins.jpg",
        character: "Deborah Allen",
      },
      {
        adult: false,
        gender: 1,
        known_for_department: "Acting",
        name: "Annabelle Mandeng",
        original_name: "Annabelle Mandeng",
        popularity: 0.7879,
        profile_path:
          "https://cdn.planetakino.ua/person/Anthony_Hopkins/Anthony+Hopkins.jpg",
        character: "Deborah Allen",
      },
      {
        adult: false,
        gender: 1,
        known_for_department: "Acting",
        name: "Annabelle Mandeng",
        original_name: "Annabelle Mandeng",
        popularity: 0.7879,
        profile_path:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTm2Z646w3yMybAVaVix_uqR1Ovczv2SKhOg&s",
        character: "Deborah Allen",
      },
    ],
  };
  return (
    <div className="h-screen">
      <BackdropSection
        backdrop_path={obj.backdrop_path}
        title={obj.title}
        original_title={obj.original_title}
        overview={obj.overview}
        release_date={obj.release_date}
      />
      <MovieDetailsSection
        genres={obj.genres}
        origin_country={obj.origin_country}
        overview={obj.overview}
        poster_path={obj.poster_path}
        production_companies={obj.production_companies}
        release_date={obj.release_date}
        runtime={obj.runtime}
        spoken_languages={obj.spoken_languages}
      />
      <TrailerSection videoKey={obj.recommendations.key} />
      <ActorsSection cast={obj.cast} />
    </div>
  );
};

export default MoviePage;
