import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function MainLayout() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div
      className={`flex min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-slate-950 text-white"
          : "bg-slate-100 text-slate-900"
      }`}
    >
      <Sidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main className="flex-1 overflow-auto">
        <Outlet context={{ darkMode }} />
      </main>
    </div>
  );
}

export default MainLayout;