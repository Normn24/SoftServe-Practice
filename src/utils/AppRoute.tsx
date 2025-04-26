import { Routes, Route } from "react-router-dom";
import { RoutePaths } from "./EnumsFile";
import MainPage from "../pages/MainPage";

function AppRoute() {
  return (
    <Routes>
      <Route path={RoutePaths.MAIN} element={<MainPage />} />
    </Routes>
  );
}

export default AppRoute;
