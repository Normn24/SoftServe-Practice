import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../api/baseQuery";
import { Movie } from "../types/authTypes";
import { Movie as MovieDetail } from "../types/movieTypes";

const transformMovieResponse = (data: {
  tmdbDetails: Record<string, unknown>;
  sessions: unknown[];
}): MovieDetail => {
  const d = data.tmdbDetails as {
    id: number;
    title: string;
    overview: string;
    release_date: string;
    runtime: number;
    poster_path: string;
    backdrop_path: string;
    original_language: string;
    original_title: string;
    popularity: number;
    vote_average: number;
    vote_count: number;
    adult: boolean;
    genres: { id: number; name: string }[];
    origin_country: string[];
    production_companies: { id: number; name: string; logo_path: string }[];
    spoken_languages: { english_name: string }[];
    recommendations: { name: string; key: string };
    videos: { key: string; type: string; site: string }[];
    cast: unknown[];
    tagline?: string;
  };

  return {
    id: d.id,
    title: d.title,
    overview: d.overview,
    release_date: d.release_date,
    runtime: d.runtime,
    poster_path: d.poster_path,
    backdrop_path: d.backdrop_path,
    original_language: d.original_language,
    original_title: d.original_title,
    popularity: d.popularity,
    vote_average: d.vote_average,
    vote_count: d.vote_count,
    adult: d.adult,
    genres: d.genres,
    origin_country: d.origin_country,
    production_companies: d.production_companies.map((c) => ({
      id: c.id,
      name: c.name,
      logo_path: c.logo_path,
    })),
    spoken_languages: d.spoken_languages.map((l) => l.english_name),
    recommendations: d.recommendations,
    videos: d.videos,
    cast: d.cast as MovieDetail["cast"],
    sessions: data.sessions as MovieDetail["sessions"],
    tagline: d.tagline ?? "",
  };
};

export const moviesApi = createApi({
  reducerPath: "moviesApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Movies", "Movie"],
  endpoints: (builder) => ({

    getMoviesInCinema: builder.query<Movie[], void>({
      query: () => "/movies-in-cinema?status=inCinema",
      providesTags: ["Movies"],
    }),

    getUpcomingMovies: builder.query<Movie[], void>({
      query: () => "/movies-in-cinema?status=comingSoon",
      providesTags: ["Movies"],
    }),

    getAllMovies: builder.query<Movie[], void>({
      query: () => "/movies-in-cinema",
      providesTags: ["Movies"],
    }),

    searchMovies: builder.query<Movie[], string>({
      query: (title) =>
        `/movies-in-cinema?title=${encodeURIComponent(title)}`,
    }),

    getSingleMovie: builder.query<MovieDetail, number>({
      query: (movieId) => `/movies-in-cinema/${movieId}`,
      transformResponse: transformMovieResponse,
      providesTags: (_result, _error, movieId) => [
        { type: "Movie", id: movieId },
      ],
    }),

  }),
});

export const {
  useGetMoviesInCinemaQuery,
  useGetUpcomingMoviesQuery,
  useGetAllMoviesQuery,
  useSearchMoviesQuery,
  useGetSingleMovieQuery,
} = moviesApi;