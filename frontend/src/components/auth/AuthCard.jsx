import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AuthCard = ({ title, subtitle, children }) => {
  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        {/* Brand */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block text-2xl font-extrabold text-primary-600">
            PrepAI
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 text-center">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-gray-500 text-center">{subtitle}</p>}
        </div>

        <div className="card shadow-md">{children}</div>
      </motion.div>
    </div>
  );
};

export default AuthCard;
