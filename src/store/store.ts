import { configureStore } from "@reduxjs/toolkit";
import { checkTokenExpiryMiddleware } from "../middleWare/checkTokenExpiryMiddleware";
import authSlice from "./authSlice";
import allMoviesSlice from "./allMovies";
import movieInCinemaSlice from "./movieInCinema";
import movieSearchSlice from "./movieSearch";
import moviesUpComming from "./newMovie";
import sessionsSlice from "./sessionsSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    allMovies: allMoviesSlice,
    movieInCinema: movieInCinemaSlice,
    movieSearch: movieSearchSlice,
    moviesUpComming: moviesUpComming,
    sessions: sessionsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(checkTokenExpiryMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
