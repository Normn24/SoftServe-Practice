import { Routes, Route } from "react-router-dom";
import { RoutePaths } from "./EnumsFile";
import MainPage from "../pages/MainPage";
import PrivateRoutes from "./PrivateRoutes";
import SessionPage from "../pages/SessionPage";

function AppRoute() {
  return (
    <Routes>
      <Route path={RoutePaths.MAIN} element={<MainPage />} />
      <Route path={RoutePaths.MOVIESESSIONS} element={<SessionPage />} />
      <Route element={<PrivateRoutes />}>
        {/* <Route path={RoutePaths.} element={} /> Example */}
      </Route>
    </Routes>
  );
}

export default AppRoute;
