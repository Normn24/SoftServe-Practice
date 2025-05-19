import { configureStore } from "@reduxjs/toolkit";
import { checkTokenExpiryMiddleware } from "../middleWare/checkTokenExpiryMiddleware";
import authSlice from "./authSlice";
import movieInCinemaSlice from "./movieInCinema";
import movieSearchSlice from "./movieSearch";
import moviesUpComming from "./newMovie";

const store = configureStore({
  reducer: {
    auth: authSlice,
    movieInCinema: movieInCinemaSlice,
    movieSearch: movieSearchSlice,
    moviesUpComming: moviesUpComming,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(checkTokenExpiryMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
