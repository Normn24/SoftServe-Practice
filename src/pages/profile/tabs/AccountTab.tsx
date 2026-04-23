import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, Save, Mail, Lock, Shield } from "lucide-react";
import { AppDispatch, RootState } from "../../../store/store";
import { updatePassword, updatePasswordLocaly } from "../../../store/profileSlice";
import { useToastContext } from "../../../components/ToastContext/context";

const AccountTab: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { showToast } = useToastContext();
  const user = useSelector((state: RootState) => state.profile.user);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const email = user[0]?.email ?? "";

  const handleUpdatePassword = async () => {
    if (!currentPassword || newPassword.length < 7) return;
    setIsLoading(true);
    try {
      await dispatch(updatePassword({ password: currentPassword, newPassword })).unwrap();
      dispatch(updatePasswordLocaly({ newPassword }));
      setCurrentPassword("");
      setNewPassword("");
      showToast("Password updated successfully", "success");
    } catch {
      showToast("Error. Check current password.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-wide">My account</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your account data</p>
      </div>

      {/* Email */}
      <section className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-4 h-4 text-yellow-400" />
          <h3 className="text-base font-semibold text-white">Email</h3>
        </div>
        <div className="bg-gray-800/50 rounded-lg px-4 py-3 text-white text-sm">
          {email}
        </div>
        <p className="text-xs text-gray-500 mt-2">Email cannot be changed</p>
      </section>

      {/* Password */}
      <section className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-4 h-4 text-yellow-400" />
          <h3 className="text-base font-semibold text-white">Change password</h3>
        </div>

        <div className="flex flex-col gap-4 max-w-md">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Current password</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 transition"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">New password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 7 characters"
                minLength={7}
                maxLength={30}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 transition"
              />
              <button
                type="button"
                onClick={() => setShowNew((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {newPassword.length > 0 && newPassword.length < 7 && (
              <p className="text-xs text-red-400 mt-1">Password is too short</p>
            )}
          </div>

          <button
            onClick={handleUpdatePassword}
            disabled={!currentPassword || newPassword.length < 7 || isLoading}
            className="flex items-center justify-center gap-2 bg-yellow-400 text-black font-semibold py-2.5 px-6 rounded-lg hover:bg-yellow-300 transition disabled:opacity-40 disabled:cursor-not-allowed w-fit"
          >
            <Save className="w-4 h-4" />
            {isLoading ? "Saving..." : "Update password"}
          </button>
        </div>
      </section>

      {/* Security */}
      <section className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-yellow-400" />
          <h3 className="text-base font-semibold text-white">Security</h3>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Two-factor authentication</span>
            <span className="text-gray-600">Soon</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Last login</span>
            <span className="text-white">Today</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AccountTab;