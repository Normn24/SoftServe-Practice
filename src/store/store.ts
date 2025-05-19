import { configureStore } from "@reduxjs/toolkit";
import { checkTokenExpiryMiddleware } from "../middleWare/checkTokenExpiryMiddleware";
import authSlice from "./authSlice";
import movieInCinemaSlice from "./movieInCinema";
import movieSearchSlice from "./movieSearch";
import movieInCinema from "./newMovie";
import favoritesSlice from "./favoritesSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    favorites: favoritesSlice,
    movieInCinema: movieInCinemaSlice,
    movieSearch: movieSearchSlice,
    movieUpComming: movieInCinema,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(checkTokenExpiryMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
