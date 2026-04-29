import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { getRoleFromToken } from "./TokenUtils";
import { RoutePaths, StatusEnum } from "./EnumsFile";
import Loader from "../components/Loader";

function AdminRoutes() {
  const { token, status } = useSelector((state: RootState) => state.auth);
  const role = token ? getRoleFromToken(token) : null;

  if (status === StatusEnum.LOADING) {
    return <Loader />;
  }
  return role === "admin" ? <Outlet /> : <Navigate to={RoutePaths.MAIN} replace />;
}

export default AdminRoutes;