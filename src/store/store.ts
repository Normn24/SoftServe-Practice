import { configureStore } from "@reduxjs/toolkit";
import { checkTokenExpiryMiddleware } from "../middleWare/checkTokenExpiryMiddleware";
import authSlice from "./authSlice";
import movieSlice from "./movieSlice";
import allMoviesSlice from "./allMovies";
import movieInCinemaSlice from "./movieInCinema";
import movieSearchSlice from "./movieSearch";
import moviesUpComming from "./newMovie";
import sessionsSlice from "./sessionsSlice";
import bookingSlice from "./bookingSlice";
import profileSlice from "./profileSlice";
import favoritesSlice from "./favoritesSlice";
import { movieApi } from "../services/movieApi";

const store = configureStore({
  reducer: {
    auth: authSlice,
    movie: movieSlice,
    profile: profileSlice,
    allMovies: allMoviesSlice,
    movieInCinema: movieInCinemaSlice,
    movieSearch: movieSearchSlice,
    moviesUpComming: moviesUpComming,
    sessions: sessionsSlice,
    booking: bookingSlice,
    favorites: favoritesSlice,
    [movieApi.reducerPath]: movieApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(checkTokenExpiryMiddleware)
      .concat(movieApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
