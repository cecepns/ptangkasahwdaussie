import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  Briefcase,
  FileText,
  Shield,
  Users,
  BarChart3,
  Layers,
  Mail,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/settings", label: "Site Settings", icon: Settings },
  { to: "/admin/services", label: "Services", icon: FileText },
  { to: "/admin/stats", label: "Hero Stats", icon: BarChart3 },
  { to: "/admin/content-items", label: "Content Items", icon: Layers },
  { to: "/admin/page-sections", label: "Page Sections", icon: Users },
  { to: "/admin/legal-documents", label: "Legal Documents", icon: Shield },
  { to: "/admin/jobs", label: "Job Listings", icon: Briefcase },
  { to: "/admin/contacts", label: "Contact Inbox", icon: Mail },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
      isActive
        ? "bg-brand-blue text-white"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
          <div>
            <p className="font-bold text-gray-900 text-sm">Angkasa HWD</p>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClass}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="px-4 py-2 mb-2">
            <p className="text-sm font-medium text-gray-900 truncate">{admin?.name || admin?.username}</p>
            <p className="text-xs text-gray-500 truncate">{admin?.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-brand-blue hover:underline"
          >
            View Site →
          </a>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
