import { Film, Ticket, Wallet, Sparkles, TrendingUp } from "lucide-react";
import { useGetUserTicketsQuery } from "../../../services/ticketsApi";
import { useGetFavoritesQuery } from "../../../services/favoritesApi";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  accent?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, accent }) => (
  <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 flex flex-col gap-3">
    <div
      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
        accent ? "bg-yellow-400/15 text-yellow-400" : "bg-gray-800 text-gray-400"
      }`}
    >
      <Icon className="w-[18px] h-[18px]" />
    </div>
    <div>
      <p className="text-2xl font-bold text-white tracking-wide">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
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
  const { data: tickets = [], isLoading: ticketsLoading } = useGetUserTicketsQuery();
  const { data: favorites = [], isLoading: favLoading } = useGetFavoritesQuery();

  const isLoading = ticketsLoading || favLoading;

  // Реальні обчислення з наявних даних
  const totalSpent = tickets.reduce((acc, t) => acc + (t.sessionPrice ?? 0), 0);
  const usedTickets = tickets.filter((t) => t.isUsed).length;

  // Найпопулярніший жанр з улюблених
  const genreCount: Record<string, number> = {};
  favorites.forEach((m) => {
    m.genres?.forEach((g) => {
      genreCount[g.name] = (genreCount[g.name] ?? 0) + 1;
    });
  });
  const favoriteGenre =
    Object.entries(genreCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  // Активність по місяцях (останні 6 місяців з реальних квитків)
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <StatCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Film} label="Movies watched" value={usedTickets} accent />
          <StatCard icon={Ticket} label="Tickets bought" value={tickets.length} />
          <StatCard icon={Wallet} label="Spent" value={`${totalSpent.toLocaleString()}₴`} />
          <StatCard icon={Sparkles} label="Favorite genre" value={favoriteGenre} accent />
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

      {/* Highlight */}
      {!isLoading && usedTickets > 0 && (
        <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-400/15 flex items-center justify-center">
            <Film className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <p className="font-semibold text-white">
              You've watched {usedTickets} {usedTickets === 1 ? "movie" : "movies"} with us
            </p>
            <p className="text-sm text-gray-400">Keep it going! 🎬</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsTab;