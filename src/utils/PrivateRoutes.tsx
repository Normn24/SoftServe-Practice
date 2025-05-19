import { Navigate, Outlet } from "react-router-dom";
import { RoutePaths } from "./EnumsFile";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { StatusEnum } from "./EnumsFile";
import Loader from "../components/Loader";

function PrivateRoutes() {
  const { token, status } = useSelector((state: RootState) => state.auth);

  if (status === StatusEnum.LOADING) {
    return <Loader />;
  }
  return token ? <Outlet /> : <Navigate to={RoutePaths.MAIN} />;
}

export default PrivateRoutes;
