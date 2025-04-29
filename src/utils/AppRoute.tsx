import { Routes, Route } from "react-router-dom";
import { RoutePaths } from "./EnumsFile";
import MainPage from "../pages/MainPage";
import AdminPage from "../pages/admin/Admin";

function AppRoute() {
  return (
    <Routes>
      <Route path={RoutePaths.MAIN} element={<MainPage />} />
      <Route path={RoutePaths.ADMIN} element = {<AdminPage/>}/>
    </Routes>
  );
}

export default AppRoute;
