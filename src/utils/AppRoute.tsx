import { Route, Routes } from "react-router-dom";
import MainPage from "../pages/MainPage";
import FilmPage from "../pages/MoviePage";
import { RoutePaths } from "./EnumsFile";

function AppRoute() {
  return (
    <Routes>
      <Route path={RoutePaths.MAIN} element={<MainPage />} />
      <Route path={RoutePaths.MOVIE} element={<FilmPage />} />
    </Routes>
  );
}

export default AppRoute;
