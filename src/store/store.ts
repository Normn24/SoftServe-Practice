import { configureStore } from "@reduxjs/toolkit";
import { checkTokenExpiryMiddleware } from "../middleWare/checkTokenExpiryMiddleware";
import authSlice from "./authSlice";
import profileSlice from "./profileSlice";
import { favoritesApi } from "../services/favoritesApi";
import { sessionsApi } from "../services/sessionsApi";
import { moviesApi } from "../services/moviesApi";

const store = configureStore({
  reducer: {
    auth: authSlice,
    profile: profileSlice,
    [moviesApi.reducerPath]: moviesApi.reducer,
    [sessionsApi.reducerPath]: sessionsApi.reducer,
    [favoritesApi.reducerPath]: favoritesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(checkTokenExpiryMiddleware)
      .concat(moviesApi.middleware)
      .concat(sessionsApi.middleware)
      .concat(favoritesApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;