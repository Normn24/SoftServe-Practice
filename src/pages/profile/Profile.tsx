import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Ticket, Heart, Bookmark, BarChart3, Bell, MessageSquare } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { fetchProfile } from "../../store/profileSlice";
import ProfileSidebar from "./components/ProfileSidebar";
import AccountTab from "./tabs/AccountTab";
import TicketsTab from "./tabs/TicketsTab";
import FavoritesTab from "./tabs/FavoritesTab";
import WishlistTab from "./tabs/WishlistTab";
import StatsTab from "./tabs/StatsTab";
import NotificationsTab from "./tabs/NotificationsTab";
import ReviewsTab from "./tabs/ReviewsTab";

type TabId = "account" | "tickets" | "favorites" | "wishlist" | "stats" | "notifications" | "reviews";

interface TabConfig {
  id: TabId;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const TABS: TabConfig[] = [
  { id: "account",       label: "Account",      icon: User },
  { id: "tickets",       label: "Tickets",      icon: Ticket },
  { id: "favorites",     label: "Favorites",    icon: Heart },
  { id: "wishlist",      label: "Wishlist",    icon: Bookmark },
  { id: "stats",         label: "Stats",  icon: BarChart3 },
  { id: "notifications", label: "Notifications",  icon: Bell },
  { id: "reviews",       label: "My reviews",   icon: MessageSquare },
];

const TAB_COMPONENTS: Record<TabId, React.FC> = {
  account:       AccountTab,
  tickets:       TicketsTab,
  favorites:     FavoritesTab,
  wishlist:      WishlistTab,
  stats:         StatsTab,
  notifications: NotificationsTab,
  reviews:       ReviewsTab,
};

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState<TabId>("account");

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const ActiveComponent = TAB_COMPONENTS[activeTab];

  return (
    <div className="min-h-screen bg-[#0e0e1b]">
      <div className="max-w-[1280px] mx-auto px-6 pt-28 pb-12 flex gap-8">

        {/* Sidebar */}
        <aside className="w-[280px] shrink-0">
          <ProfileSidebar
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab as TabId)}
            tabs={TABS}
          />
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </main>

      </div>
    </div>
  );
};

export default Profile;