import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfile,
  updatePassword,
  updatePasswordLocaly,
} from "../../store/profileSlice";
import { useToastContext } from "../../components/ToastContext/context";

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const { showToast } = useToastContext();
  const user = useSelector((state: RootState) => state.profile.user);

  const [newPassword, setNewPassword] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleUpdate = async () => {
    if (!newPassword.trim()) {
      showToast("Please enter a new password", "error");
      return;
    }
    if (newPassword.length < 7 || newPassword.length > 30) {
      showToast("Password must be between 7 and 30 characters", "error");
      return;
    }

    try {
      await dispatch(
        updatePassword({ password, newPassword })
      ).unwrap();

      dispatch(updatePasswordLocaly({ newPassword }));
      setPassword("");
      setNewPassword("");
      showToast("Password updated successfully", "success");
    } catch {
      showToast("Failed to update password. Check your current password.", "error");
    }
  };

  if (user.length === 0) return null;

  return (
    <section className="flex flex-col justify-center px-100 gap-5">
      <h1 className="text-3xl font-bold py-2">User Profile</h1>

      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-row items-center justify-between w-full">
          <h1 className="font-medium text-2xl">Email:</h1>
          <input
            type="text"
            className="input text-white bg-gray-800 border border-white"
            value={user[0].email}
            disabled
          />
        </div>

        <div className="flex flex-row items-center justify-between w-full">
          <h1 className="font-medium text-2xl">Old Password:</h1>
          <input
            type="password"
            placeholder="Enter current password"
            className="input text-white bg-gray-800 border border-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex flex-row items-center justify-between w-full">
          <h1 className="font-medium text-2xl">New Password:</h1>
          <input
            type="password"
            placeholder="Enter new password"
            className="input text-white bg-gray-800 border border-white"
            value={newPassword}
            minLength={7}
            maxLength={30}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <button
          className="btn btn-lg w-full bg-yellow-400 text-black border-none"
          onClick={handleUpdate}
        >
          Update
        </button>
      </div>
    </section>
  );
}