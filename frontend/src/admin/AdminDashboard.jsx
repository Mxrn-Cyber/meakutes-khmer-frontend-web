import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Newspaper, Users, Star } from "lucide-react";
import { api } from "../api/client";

function StatCard({ icon: Icon, label, value, to }) {
  return (
    <Link
      to={to}
      className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex items-center gap-4 hover:shadow-md transition-shadow"
    >
      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
        <Icon className="text-blue-600 dark:text-blue-400" size={24} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </Link>
  );
}

const AdminDashboard = () => {
  const [stats, setStats] = useState({ destinations: null, news: null, users: null });

  useEffect(() => {
    Promise.all([
      api.listDestinations({ status: "all" }).catch(() => []),
      api.listNews({ status: "all" }).catch(() => []),
      api.adminListUsers().catch(() => []),
    ]).then(([destinations, news, users]) => {
      setStats({ destinations: destinations.length, news: news.length, users: users.length });
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard icon={MapPin} label="Destinations" value={stats.destinations ?? "..."} to="/admin/destinations" />
        <StatCard icon={Newspaper} label="News & events" value={stats.news ?? "..."} to="/admin/news" />
        <StatCard icon={Users} label="Users" value={stats.users ?? "..."} to="/admin/users" />
      </div>
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Star size={18} className="text-amber-400" /> Reviews need moderation from time to time
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Check the Reviews page for anything flagged, or that looks off.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
