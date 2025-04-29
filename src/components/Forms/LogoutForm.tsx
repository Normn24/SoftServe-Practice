import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { clearToken } from "../../store/authSlice";
import { RoutePaths } from "../../utils/EnumsFile";

interface LogoutProps {
  handleClose: () => void;
}

function LogoutForm({ handleClose }: LogoutProps) {
  const dispatch = useDispatch<AppDispatch>();
  const handleLogout = () => {
    dispatch(clearToken());
    window.location.href = `${RoutePaths.MAIN}`;
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-420 max-w-md">
      <h2 className="text-center text-2xl font-bold text-gray-700 mb-6">
        Are you sure?
      </h2>
      <div className="flex justify-center gap-2">
        <button
          onClick={handleLogout}
          className="w-max bg-red-600 hover:bg-red-500 text-black py-2 px-8 rounded-lg transition font-bold text-md uppercase"
        >
          Yes
        </button>
        <button
          onClick={handleClose}
          className="w-max bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-8 rounded-lg transition font-bold text-md uppercase"
        >
          No
        </button>
      </div>
    </div>
  );
}

export default LogoutForm;
