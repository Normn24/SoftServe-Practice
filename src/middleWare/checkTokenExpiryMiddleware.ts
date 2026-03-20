import { Middleware } from "@reduxjs/toolkit";
import { clearToken } from "../store/authSlice";
import { RootState } from "../store/store";
import { isTokenExpired } from "../utils/TokenUtils";
import { RoutePaths } from "../utils/EnumsFile";
import { navigate } from "../utils/navigationRef";

let isClearingToken = false;

export const checkTokenExpiryMiddleware: Middleware =
  (store) => (next) => (action) => {
    const state = store.getState() as RootState;

    if (isClearingToken) return next(action);

    if (state.auth.token && isTokenExpired(state.auth.token)) {
      isClearingToken = true;
      store.dispatch(clearToken());

      navigate(RoutePaths.MAIN);

      setTimeout(() => {
        isClearingToken = false;
      }, 0);

      return;
    }

    return next(action);
  };