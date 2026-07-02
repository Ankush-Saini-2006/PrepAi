import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { MailCheck, AlertCircle } from "lucide-react";
import { verifyEmail, clearStatus } from "../../features/auth/authSlice";
import Spinner from "../../components/common/Spinner";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const { loading, verificationStatus, error } = useSelector((s) => s.auth);

  useEffect(() => {
    if (token) {
      dispatch(verifyEmail(token));
    }
    return () => dispatch(clearStatus());
  }, [token, dispatch]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm text-gray-500">Verifying your email address…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card max-w-md w-full text-center py-10 shadow-md"
      >
        {verificationStatus === "success" ? (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <MailCheck size={30} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Email Verified!</h2>
            <p className="mt-2 text-sm text-gray-500">
              Your PrepAI account is now fully active. You can access all features.
            </p>
            <Link to="/dashboard" className="btn-primary mt-6 inline-block">
              Go to Dashboard
            </Link>
          </>
        ) : (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
              <AlertCircle size={30} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Verification Failed</h2>
            <p className="mt-2 text-sm text-gray-500">
              {error || "This verification link is invalid or has expired."}
            </p>
            <Link to="/resend-verification" className="btn-primary mt-6 inline-block">
              Resend Verification Email
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
