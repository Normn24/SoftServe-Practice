import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../api/baseQuery";
import { Movie } from "../types/authTypes";

export const moviesApi = createApi({
  reducerPath: "moviesApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Movies"],
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
      query: (title) => `/movies-in-cinema?title=${encodeURIComponent(title)}`,
    }),
  }),
});

export const {
  useGetMoviesInCinemaQuery,
  useGetUpcomingMoviesQuery,
  useGetAllMoviesQuery,
  useSearchMoviesQuery,
} = moviesApi;