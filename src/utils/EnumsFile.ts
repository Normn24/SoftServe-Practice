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
  MOVIE = "/movies/:movieId",
  NewMovies = "/coming-soon",
  Favorites = "/favorites",
  MOVIESESSIONS = "/:movieId/sessions",
  MOVIESESSIONSBOOK = "/:movieId/sessions/:sessionId",
  MOVIESESSIONSPAYMENT = "/checkout/:movieId/:sessionId",
  ADMIN = "/admin",
  SCANNER = "/admin/scan",
  PROFILE = "/profile",
}