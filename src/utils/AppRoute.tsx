import { Routes, Route } from "react-router-dom";
import { RoutePaths } from "./EnumsFile";
import MainPage from "../pages/MainPage";
import NewMoviesPage from "../pages/NewMoviesPage";
import PrivateRoutes from "./PrivateRoutes";

function AppRoute() {
  return (
    <Routes>
      <Route path={RoutePaths.MAIN} element={<MainPage />} />
      <Route path={RoutePaths.NewMovies} element={<NewMoviesPage />} />
      <Route element={<PrivateRoutes />}>
        {/* <Route path={RoutePaths.} element={} /> Example */}
      </Route>
    </Routes>
  );
}

export default AppRoute;
