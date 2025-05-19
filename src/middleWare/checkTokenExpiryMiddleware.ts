import { Middleware } from "@reduxjs/toolkit";
import { clearToken } from "../store/authSlice";
import { RootState } from "../store/store";
import { isTokenExpired } from "../utils/TokenUtils";
import { RoutePaths } from "../utils/EnumsFile";

let isClearingToken = false;

export const checkTokenExpiryMiddleware: Middleware =
  (store) => (next) => (action) => {
    const state: RootState = store.getState();
    if (isClearingToken) return next(action);

    if (state.auth.token && isTokenExpired(state.auth.token)) {
      isClearingToken = true;
      store.dispatch(clearToken());
      window.location.href = RoutePaths.MAIN;
      return;
    }

    return next(action);
  };
