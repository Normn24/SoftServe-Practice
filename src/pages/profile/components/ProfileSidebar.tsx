import { useDispatch, useSelector } from "react-redux";
import { Calendar, LogOut } from "lucide-react";
import { AppDispatch, RootState } from "../../../store/store";
import { clearToken } from "../../../store/authSlice";
import { navigate } from "../../../utils/navigationRef";
import { RoutePaths } from "../../../utils/EnumsFile";
import { useGetUserTicketsQuery } from "../../../services/ticketsApi";

interface ProfileSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: { id: string; label: string; icon: React.ElementType; badge?: number }[];
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ activeTab, onTabChange, tabs }) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.profile.user);
  const { data: tickets = [] } = useGetUserTicketsQuery();

  const email = user[0]?.email ?? "";
  const displayName = email.split("@")[0] ?? "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  const totalSpent = tickets.reduce((acc, t) => acc + (t.sessionPrice ?? 0), 0);

  const handleLogout = () => {
    dispatch(clearToken());
    navigate(RoutePaths.MAIN);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Avatar card */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-yellow-400/15 border-2 border-yellow-400/40 flex items-center justify-center">
          <span className="text-2xl font-bold text-yellow-400">{initials}</span>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-white">{displayName}</h2>
          <p className="text-sm text-gray-400">{email}</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>CD Player Cinema</span>
        </div>
        {totalSpent > 0 && (
          <div className="w-full pt-3 border-t border-gray-800">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Spent:</span>
              <span className="font-semibold text-yellow-400">{totalSpent.toLocaleString()}₴</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-yellow-400/10 text-yellow-400"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" />
              <span className="flex-1 text-left">{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="bg-yellow-400 text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-400/10 transition-all"
      >
        <LogOut className="w-[18px] h-[18px]" />
        Logout
      </button>
    </div>
  );
};

export default ProfileSidebar;