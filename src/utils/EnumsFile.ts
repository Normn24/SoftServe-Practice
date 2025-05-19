export enum StatusEnum {
  ERROR = "error",
  SUCCESS = "success",
  IDLE = "idle",
  LOADING = "loading",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
  FULFILLED = "fulfilled",
}

export enum RoutePaths {
  MAIN = "/",
  Favorites = "/favorites",
  MOVIESESSIONS = "/:movieId/sessions",
  MOVIESESSIONSBOOK = "/:movieId/sessions/:sessionId",
  MOVIESESSIONSPAYMENT = "/checkout/:movieId/:sessionId",
  ADMIN = "/admin",
  PROFILE = '/profile'
}
