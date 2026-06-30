import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import { logoutUser } from "../../features/auth/authSlice";
import toast from "react-hot-toast";

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary-600">PrepAI</span>
          <span className="hidden text-xs font-medium text-gray-400 sm:inline">
            AI Career &amp; Placement Coach
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-medium text-gray-600 hover:text-primary-600"
              >
                Dashboard
              </Link>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="btn-secondary !py-2 !px-4 text-sm"
              >
                Logout
              </motion.button>
              <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700 sm:flex">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </>
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
