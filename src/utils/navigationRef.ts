import { NavigateFunction } from "react-router-dom";

let navigateFn: NavigateFunction | null = null;

export const setNavigate = (fn: NavigateFunction): void => {
  navigateFn = fn;
};

export const navigate = (to: string): void => {
  if (navigateFn) {
    navigateFn(to, { replace: true });
  } else {
    console.warn("[navigationRef] navigate called before App mounted, using fallback");
    window.location.replace(to);
  }
};