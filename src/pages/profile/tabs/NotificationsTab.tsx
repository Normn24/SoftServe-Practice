import { Bell, Clock } from "lucide-react";

const NotificationsTab: React.FC = () => (
  <div className="flex flex-col gap-6">
    <div>
      <h1 className="text-3xl font-bold text-white tracking-wide">Notifications</h1>
      <p className="text-gray-400 text-sm mt-1">Notifications about sessions and promotions</p>
    </div>

    <div className="bg-gray-900 rounded-xl border border-gray-800 border-dashed p-16 flex flex-col items-center gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-yellow-400/10 flex items-center justify-center">
        <Bell className="w-8 h-8 text-yellow-400/50" />
      </div>
      <div>
        <p className="font-semibold text-white">Notifications will appear soon</p>
        <p className="text-sm text-gray-500 mt-1">
          There will be reminders about your sessions, rental news
          and personal offers
        </p>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-yellow-400/60 mt-2">
        <Clock className="w-3.5 h-3.5" />
        <span>In development</span>
      </div>
    </div>
  </div>
);

export default NotificationsTab;