import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Settings, ChevronDown, AlertCircle, LayoutDashboard, Moon, SunMedium, Sparkles
} from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import { logoutUser } from "../../features/auth/authSlice";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem("prepai-theme") === "dark" ? "dark" : "light";
};

const UserMenu = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="theme-surface flex items-center gap-2 rounded-full px-3 py-1.5 hover:-translate-y-0.5"
      >
        {user?.avatar?.url ? (
          <img
            src={user.avatar.url}
            alt={user.name}
            className="h-7 w-7 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-primary-700 dark:bg-slate-700 dark:text-white">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}
        <span className="hidden max-w-[120px] truncate text-sm font-medium text-[color:var(--page-text)] sm:block">
          {user?.name?.split(" ")[0]}
        </span>
        {!user?.isVerified && (
          <AlertCircle size={14} className="text-amber-500" title="Email not verified" />
        )}
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="theme-surface absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl py-1.5 shadow-xl"
          >
            <div className="border-b border-[color:var(--page-border)] px-4 py-2.5">
              <p className="truncate text-sm font-semibold text-[color:var(--page-text)]">{user?.name}</p>
              <p className="truncate text-xs theme-text-muted">{user?.email}</p>
            </div>

            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm theme-text-muted hover:bg-black/5 dark:hover:bg-white/10"
            >
              <LayoutDashboard size={15} /> Dashboard
            </Link>
            <Link
              to="/dashboard/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm theme-text-muted hover:bg-black/5 dark:hover:bg-white/10"
            >
              <Settings size={15} /> Account Settings
            </Link>

            <div className="my-1 border-t border-[color:var(--page-border)]" />

            <button
              onClick={() => { onLogout(); setOpen(false); }}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              <LogOut size={15} /> Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("prepai-theme", theme);
  }, [theme]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success("Signed out successfully");
    navigate("/login");
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  return (
    <header className="theme-navbar sticky top-0 z-40">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-violet-600 text-sm font-bold text-white shadow-lg shadow-primary-500/20">
            <Sparkles size={16} />
          </span>
          <span className="text-xl font-extrabold text-[color:var(--page-text)]">PrepAI</span>
          <span className="hidden text-xs font-medium theme-text-muted lg:inline">
            AI Career & Placement Coach
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            type="button"
            className="theme-surface flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm hover:-translate-y-0.5"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? <SunMedium size={16} /> : <Moon size={16} />}
            <span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"}</span>
          </button>

          {isAuthenticated ? (
            <UserMenu user={user} onLogout={handleLogout} />
          ) : (
            <>
              <Link to="/login" className="btn-secondary !py-2 !px-4 text-sm">
                Login
              </Link>
              <Link to="/register" className="btn-primary !py-2 !px-4 text-sm">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
