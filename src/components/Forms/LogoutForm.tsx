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
    <div className="bg-[#2b2f31] shadow-lg rounded-lg px-8 pt-6 pb-8 w-[440px] max-w-md">
      <h2 className="text-center text-2xl font-bold text-white mb-6">
        Are you sure?
      </h2>
      <div className="flex justify-center gap-8">
        <button
          onClick={handleLogout}
          className="w-max bg-red-600 hover:bg-red-500 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          Yes
        </button>
        <button
          onClick={handleClose}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          No
        </button>
      </div>
    </div>
  );
}

export default LogoutForm;
