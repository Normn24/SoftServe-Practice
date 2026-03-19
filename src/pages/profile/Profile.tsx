import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfile,
  updatePassword,
  updatePasswordLocaly,
} from "../../store/profileSlice";
import { toast } from "../../utils/toast";

const PASSWORD_MIN = 7;
const PASSWORD_MAX = 30;

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.profile);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const isFormValid =
    currentPassword.trim().length > 0 &&
    newPassword.length >= PASSWORD_MIN &&
    newPassword.length <= PASSWORD_MAX;

  const handleUpdate = async () => {
    if (!isFormValid) {
      toast.warning(
        `Password must be between ${PASSWORD_MIN} and ${PASSWORD_MAX} characters`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(
        updatePassword({ password: currentPassword, newPassword })
      ).unwrap();

      dispatch(updatePasswordLocaly({ newPassword }));
      toast.success("Password updated successfully");

      // Скидаємо форму після успіху
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      toast.error("Failed to update password. Check your current password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-dots loading-xl bg-yellow-400" />
      </div>
    );
  }

  return (
    <section className="flex flex-col justify-center px-4 md:px-100 gap-5 pt-28 min-h-screen">
      <h1 className="text-3xl font-bold py-2">User Profile</h1>

      {user.length > 0 && (
        <div className="flex flex-col gap-6 w-full max-w-lg">
          <div className="flex flex-row items-center justify-between w-full">
            <label className="font-medium text-2xl" htmlFor="email">
              Email:
            </label>
            <input
              id="email"
              type="text"
              className="input text-white bg-gray-800 border border-white"
              value={user[0].email}
              disabled
            />
          </div>

          <div className="flex flex-row items-center justify-between w-full">
            <label className="font-medium text-2xl" htmlFor="currentPassword">
              Current Password:
            </label>
            <input
              id="currentPassword"
              type="password"
              placeholder="Enter current password"
              className="input text-white bg-gray-800 border border-white"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center justify-between w-full">
              <label className="font-medium text-2xl" htmlFor="newPassword">
                New Password:
              </label>
              <input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                className="input text-white bg-gray-800 border border-white"
                value={newPassword}
                minLength={PASSWORD_MIN}
                maxLength={PASSWORD_MAX}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            {newPassword.length > 0 && newPassword.length < PASSWORD_MIN && (
              <p className="text-red-400 text-sm text-right">
                Minimum {PASSWORD_MIN} characters
              </p>
            )}
          </div>

          <button
            className="btn btn-lg w-full bg-yellow-400 text-black border-none disabled:opacity-50"
            onClick={handleUpdate}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Update"
            )}
          </button>
        </div>
      )}
    </section>
  );
}