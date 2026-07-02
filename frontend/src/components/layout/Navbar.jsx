import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Settings, ChevronDown, AlertCircle, LayoutDashboard
} from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import { logoutUser } from "../../features/auth/authSlice";

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
        className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5 hover:bg-gray-50"
      >
        {user?.avatar?.url ? (
          <img
            src={user.avatar.url}
            alt={user.name}
            className="h-7 w-7 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}
        <span className="hidden max-w-[120px] truncate text-sm font-medium text-gray-700 sm:block">
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
            className="absolute right-0 mt-2 w-52 rounded-2xl border border-gray-100 bg-white py-1.5 shadow-lg"
          >
            <div className="border-b border-gray-100 px-4 py-2.5">
              <p className="truncate text-sm font-semibold text-gray-900">{user?.name}</p>
              <p className="truncate text-xs text-gray-400">{user?.email}</p>
            </div>

            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              <LayoutDashboard size={15} /> Dashboard
            </Link>
            <Link
              to="/dashboard/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              <Settings size={15} /> Account Settings
            </Link>

            <div className="my-1 border-t border-gray-100" />

            <button
              onClick={() => { onLogout(); setOpen(false); }}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50"
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

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success("Signed out successfully");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold text-primary-600">PrepAI</span>
          <span className="hidden text-xs font-medium text-gray-400 lg:inline">
            AI Career & Placement Coach
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <UserMenu user={user} onLogout={handleLogout} />
          ) : (
            <>
              <Link to="/login" className="btn-secondary !py-2 !px-4 text-sm">
                Log In
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
