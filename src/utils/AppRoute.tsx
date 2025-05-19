import { Routes, Route } from "react-router-dom";
import { RoutePaths } from "./EnumsFile";
import MainPage from "../pages/MainPage";
import PrivateRoutes from "./PrivateRoutes";
import FavoritesPage from "../components/Favorites/favorites";
import SessionPage from "../pages/SessionPage";
import SeatSelectionPage from "../pages/SeatSelectionPage";
import PaymentPage from "../pages/PaymentPage";
import AdminPage from "../pages/admin/Admin";
import Profile from "../pages/profile/Profile";

function AppRoute() {
  return (
    <Routes>
      <Route path={RoutePaths.MAIN} element={<MainPage />} />
      <Route path={RoutePaths.MOVIESESSIONS} element={<SessionPage />} />
      <Route
        path={RoutePaths.MOVIESESSIONSBOOK}
        element={<SeatSelectionPage />}
      />
      <Route element={<PrivateRoutes />}>
        <Route
          path={RoutePaths.MOVIESESSIONSPAYMENT}
          element={<PaymentPage />}
        />
      <Route path = {RoutePaths.PROFILE} element = {<Profile/>}/>
      <Route path={RoutePaths.ADMIN} element={<AdminPage />} />
      <Route path={RoutePaths.Favorites} element={<FavoritesPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoute;
