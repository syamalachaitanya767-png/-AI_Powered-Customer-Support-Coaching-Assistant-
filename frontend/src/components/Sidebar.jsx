import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  MessageSquarePlus,
  BookOpen,
  FileBarChart,
  BarChart3,
  Settings,
  Sun,
  Moon,
  Sparkles,
  Zap,
  Radio
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { getSystemStatus } from "../services/api";

function Sidebar({ darkMode, setDarkMode }) {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        await getSystemStatus();
        setOnline(true);
      } catch (err) {
        setOnline(false);
      }
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  const menus = [
    {
      name: "Dashboard",
      path: "/",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      name: "Live Coaching",
      path: "/new-session",
      icon: <MessageSquarePlus className="w-4 h-4" />,
      badge: "Copilot",
    },
    {
      name: "Knowledge Base",
      path: "/knowledge-base",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      name: "Audit Reports",
      path: "/reports",
      icon: <FileBarChart className="w-4 h-4" />,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <aside
      className={`w-64 min-h-screen flex flex-col shadow-xl transition-all duration-300 select-none ${
        darkMode ? "bg-slate-900 border-r border-slate-800 text-white" : "bg-white border-r border-slate-200 text-slate-900"
      }`}
    >
      {/* Brand Header */}
      <div className={`p-5 border-b ${darkMode ? "border-slate-800" : "border-slate-100"}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight flex items-center gap-1.5">
              <span>AI Coach</span>
              <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                PRO
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Customer Support Assistant</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 p-3 space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 block">
          Platform Menu
        </span>

        {menus.map((menu) => (
          <NavLink
            key={menu.name}
            to={menu.path}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                  : darkMode
                  ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`
            }
          >
            <div className="flex items-center gap-3">
              {menu.icon}
              <span>{menu.name}</span>
            </div>

            {menu.badge && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {menu.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>

      {/* Connection & Theme Status Footer */}
      <div className={`p-4 border-t space-y-3 ${darkMode ? "border-slate-800 bg-slate-950/40" : "border-slate-100 bg-slate-50/50"}`}>
        {/* Backend Status Pill */}
        <div className={`flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-semibold border ${
          darkMode ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200"
        }`}>
          <span className="text-slate-400 flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-indigo-400" /> Backend Engine:
          </span>
          <span className={`flex items-center gap-1.5 font-bold ${online ? "text-emerald-400" : "text-rose-400"}`}>
            <span className={`w-2 h-2 rounded-full ${online ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
            {online ? "Connected" : "Offline"}
          </span>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            {darkMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            <span>{darkMode ? "Dark Theme" : "Light Theme"}</span>
          </span>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-11 h-6 rounded-full relative transition-colors ${
              darkMode ? "bg-indigo-600" : "bg-slate-300"
            }`}
            title="Toggle theme mode"
          >
            <div
              className={`w-4 h-4 rounded-full bg-white shadow-sm absolute top-1 transition-all ${
                darkMode ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;