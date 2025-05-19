import { Routes, Route } from "react-router-dom";
import { RoutePaths } from "./EnumsFile";
import MainPage from "../pages/MainPage";
import PrivateRoutes from "./PrivateRoutes";
import FavoritesPage from "../components/Favorites/favorites";

function AppRoute() {
  return (
    <Routes>
      <Route path={RoutePaths.MAIN} element={<MainPage />} />
      <Route path={RoutePaths.Favorites} element={<FavoritesPage />} />
      <Route element={<PrivateRoutes />}>
        {/* <Route path={RoutePaths.} element={} /> Example */}
      </Route>
    </Routes>
  );
}

export default AppRoute;

