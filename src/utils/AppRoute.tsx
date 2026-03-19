import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { RoutePaths } from "./EnumsFile";
import PrivateRoutes from "./PrivateRoutes";
import Loader from "../components/Loader";

const MainPage = lazy(() => import("../pages/MainPage"));
const FilmPage = lazy(() => import("../pages/MoviePage"));
const NewMoviesPage = lazy(() => import("../pages/NewMoviesPage"));
const FavoritesPage = lazy(
  () => import("../components/Favorites/favorites")
);
const SessionPage = lazy(() => import("../pages/SessionPage"));
const SeatSelectionPage = lazy(() => import("../pages/SeatSelectionPage"));
const PaymentPage = lazy(() => import("../pages/PaymentPage"));
const AdminPage = lazy(() => import("../pages/admin/Admin"));
const Profile = lazy(() => import("../pages/profile/Profile"));

const PageLoader = () => (
  <div className="flex items-center justify-center h-screen bg-black">
    <Loader />
  </div>
);

function AppRoute() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path={RoutePaths.MAIN} element={<MainPage />} />
        <Route path={RoutePaths.MOVIE} element={<FilmPage />} />
        <Route path={RoutePaths.NewMovies} element={<NewMoviesPage />} />
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
          <Route path={RoutePaths.PROFILE} element={<Profile />} />
          <Route path={RoutePaths.ADMIN} element={<AdminPage />} />
          <Route path={RoutePaths.Favorites} element={<FavoritesPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRoute;