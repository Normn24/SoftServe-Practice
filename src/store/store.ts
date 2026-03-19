import { configureStore } from "@reduxjs/toolkit";
import { checkTokenExpiryMiddleware } from "../middleWare/checkTokenExpiryMiddleware";
import authSlice from "./authSlice";
import movieSlice from "./movieSlice";
import bookingSlice from "./bookingSlice";
import profileSlice from "./profileSlice";
import { favoritesApi } from "../services/favoritesApi";
import { sessionsApi } from "../services/sessionsApi";
import { moviesApi } from "../services/moviesApi";

const store = configureStore({
  reducer: {
    auth: authSlice,
    movie: movieSlice,
    profile: profileSlice,
    booking: bookingSlice,
    [favoritesApi.reducerPath]: favoritesApi.reducer,
    [sessionsApi.reducerPath]: sessionsApi.reducer,
    [moviesApi.reducerPath]: moviesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(checkTokenExpiryMiddleware)
      .concat(favoritesApi.middleware)
      .concat(sessionsApi.middleware)
      .concat(moviesApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;