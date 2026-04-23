import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { RoutePaths } from "./EnumsFile";
import Loader from "../components/Loader";
import PrivateRoutes from "./PrivateRoutes";

import MainPage from "../pages/MainPage";

const MoviePage        = lazy(() => import("../pages/MoviePage"));
const NewMoviesPage    = lazy(() => import("../pages/NewMoviesPage"));
const SessionPage      = lazy(() => import("../pages/SessionPage"));
const SeatSelectionPage = lazy(() => import("../pages/SeatSelectionPage"));
const PaymentPage      = lazy(() => import("../pages/PaymentPage"));
const AdminPage        = lazy(() => import("../pages/admin/Admin"));
const ScannerPage      = lazy(() => import("../pages/admin/ScannerPage"));
const Profile          = lazy(() => import("../pages/profile/Profile"));
const FavoritesPage    = lazy(() => import("../components/Favorites/favorites"));

function AppRoute() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path={RoutePaths.MAIN}                element={<MainPage />} />
        <Route path={RoutePaths.MOVIE}               element={<MoviePage />} />
        <Route path={RoutePaths.NewMovies}           element={<NewMoviesPage />} />
        <Route path={RoutePaths.MOVIESESSIONS}       element={<SessionPage />} />
        <Route path={RoutePaths.MOVIESESSIONSBOOK}   element={<SeatSelectionPage />} />

        <Route element={<PrivateRoutes />}>
          <Route path={RoutePaths.MOVIESESSIONSPAYMENT} element={<PaymentPage />} />
          <Route path={RoutePaths.PROFILE}              element={<Profile />} />
          <Route path={RoutePaths.ADMIN}                element={<AdminPage />} />
          <Route path={RoutePaths.SCANNER}              element={<ScannerPage />} />
          <Route path={RoutePaths.Favorites}            element={<FavoritesPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRoute;