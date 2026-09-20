import { NavLink, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard,
  MapPin,
  Newspaper,
  Tags,
  Image,
  Star,
  Users,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const baseLinks = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/destinations", label: "Destinations", icon: MapPin },
  { to: "/admin/news", label: "News & Events", icon: Newspaper },
  { to: "/admin/taxonomy", label: "Categories & Tags", icon: Tags },
  { to: "/admin/media", label: "Media Library", icon: Image },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
];

const adminOnlyLinks = [{ to: "/admin/users", label: "Users & Roles", icon: Users }];

const AdminLayout = () => {
  const { isAdmin } = useAuth();
  const links = isAdmin ? [...baseLinks, ...adminOnlyLinks] : baseLinks;
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex md:flex-col">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            Meakutes-Khmer Admin
          </h1>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft size={18} />
            Back to site
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 max-w-6xl">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
