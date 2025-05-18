import { configureStore } from "@reduxjs/toolkit";
import { checkTokenExpiryMiddleware } from "../middleWare/checkTokenExpiryMiddleware";
import authSlice from "./authSlice";
import allMoviesSlice from "./allMovies";
import movieInCinemaSlice from "./movieInCinema";
import movieSearchSlice from "./movieSearch";
import moviesUpComming from "./newMovie";
import sessionsSlice from "./sessionsSlice";
import bookingSlice from "./bookingSlice";
import profileSlice from './profileSlice'

const store = configureStore({
  reducer: {
    auth: authSlice,
    profile: profileSlice,
    allMovies: allMoviesSlice,
    movieInCinema: movieInCinemaSlice,
    movieSearch: movieSearchSlice,
    moviesUpComming: moviesUpComming,
    sessions: sessionsSlice,
    booking: bookingSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(checkTokenExpiryMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
