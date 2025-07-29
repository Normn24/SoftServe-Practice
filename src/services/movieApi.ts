import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Movie } from "../types/authTypes";
import { createSelector } from "@reduxjs/toolkit";

export const movieApi = createApi({
  reducerPath: "movieApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL }),
  endpoints: (builder) => ({
    getMoviesInCinema: builder.query<Movie[], string>({
      query: (status) => `/movies-in-cinema?status=${status}`,
    }),
  }),
});

export const { useGetMoviesInCinemaQuery } = movieApi;

export const selectMoviesResult =
  movieApi.endpoints.getMoviesInCinema.select("inCinema");

// 2. Створюємо мемоізований селектор, який витягує тільки дані (data) з результату
// Використовуємо `createSelector` для ефективності. Він буде перераховуватися, тільки якщо зміниться результат запиту.
const selectMoviesData = createSelector(
  selectMoviesResult,
  (moviesResult) => moviesResult.data // Отримуємо поле 'data'
);

// 3. Створюємо "безпечний" селектор, який завжди повертає масив
// Це запобігає помилкам, якщо дані ще не завантажені (moviesResult.data буде undefined)
const emptyMovies: Movie[] = []; // Створюємо одне посилання на порожній масив для стабільності
export const selectAllMovies = createSelector(
  selectMoviesData,
  (movies) => movies ?? emptyMovies // Якщо movies - undefined, повертаємо порожній масив
);
