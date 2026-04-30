import { Film, Ticket, Wallet, Sparkles, TrendingUp, MessageSquare, Star } from "lucide-react";
import { useGetUserTicketsQuery } from "../../../services/ticketsApi";
import { useGetFavoritesQuery } from "../../../services/favoritesApi";
import { useGetUserReviewStatsQuery } from "../../../services/reviewsApi";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  accent?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, accent }) => (
  <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 flex flex-col gap-3">
    <div className="flex items-center gap-2 mb-2">
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
          accent ? "bg-yellow-400/15 text-yellow-400" : "bg-gray-800 text-gray-400"
        }`}
      >
        <Icon className="w-[18px] h-[18px]" />
      </div>
      <p className="text-md text-gray-400 mt-0.5">{label}</p>
    </div>
    <div>
      <p className="text-2xl font-bold text-white tracking-wide">{value}</p>
    </div>
  </div>
);

const StatCardSkeleton = () => (
  <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 flex flex-col gap-3 animate-pulse">
    <div className="w-9 h-9 rounded-lg bg-gray-800" />
    <div className="h-6 bg-gray-800 rounded w-1/2" />
    <div className="h-3 bg-gray-800 rounded w-2/3" />
  </div>
);

const StatsTab: React.FC = () => {
  const { data: ticketsResponse, isLoading: ticketsLoading } = useGetUserTicketsQuery({ page: 1, limit: 999, status: "all" });
  const tickets = ticketsResponse?.tickets ?? [];
  const { data: favorites = [], isLoading: favLoading } = useGetFavoritesQuery();
  const { data: reviewStats, isLoading: reviewsLoading } = useGetUserReviewStatsQuery();

  const isLoading = ticketsLoading || favLoading || reviewsLoading;

  const totalSpent = tickets.reduce((acc, t) => acc + (t.sessionPrice ?? 0), 0);
  const usedTickets = tickets.filter((t) => t.isUsed).length;

  const genreCount: Record<string, number> = {};
  favorites.forEach((m) => {
    m.genres?.forEach((g) => {
      genreCount[g.name] = (genreCount[g.name] ?? 0) + 1;
    });
  });
  const favoriteGenre =
    Object.entries(genreCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  const monthlyData = (() => {
    const months: { month: string; count: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString("uk-UA", { month: "short" });
      const count = tickets.filter((t) => {
        if (!t.sessionDateTime) return false;
        const td = new Date(t.sessionDateTime);
        return td.getFullYear() === d.getFullYear() && td.getMonth() === d.getMonth();
      }).length;
      months.push({ month: label, count });
    }
    return months;
  })();

  const maxCount = Math.max(...monthlyData.map((m) => m.count), 1);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-wide">Statistics</h1>
        <p className="text-gray-400 text-sm mt-1">Your movie activity</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <StatCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard icon={Film} label="Movies watched" value={usedTickets} accent />
          <StatCard icon={Ticket} label="Tickets bought" value={tickets.length} />
          <StatCard icon={Wallet} label="Spent" value={`${totalSpent.toLocaleString()}₴`} />
          <StatCard icon={Sparkles} label="Favorite genre" value={favoriteGenre} accent />
          <StatCard icon={MessageSquare} label="Reviews written" value={reviewStats?.count ?? 0} />
          <StatCard icon={Star} label="Avg rating given" value={reviewStats?.avgRating ? reviewStats.avgRating.toFixed(1) : "—"} accent />
        </div>
      )}

      {/* Monthly chart */}
      <section className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-4 h-4 text-yellow-400" />
          <h3 className="text-base font-semibold text-white">Movies viewed per month</h3>
        </div>
        <div className="flex items-end gap-3 h-40">
          {monthlyData.map((m) => {
            const heightPct = (m.count / maxCount) * 100;
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                {m.count > 0 && (
                  <span className="text-xs font-medium text-white">{m.count}</span>
                )}
                <div className="w-full relative" style={{ height: "100px" }}>
                  <div
                    className="absolute bottom-0 w-full bg-yellow-400/20 rounded-t-md transition-all duration-500"
                    style={{ height: `${heightPct || 4}%` }}
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-yellow-400 rounded-t-md" />
                  </div>
                </div>
                <span className="text-xs text-gray-400">{m.month}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default StatsTab;