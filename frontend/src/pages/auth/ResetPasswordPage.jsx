import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, AlertCircle } from "lucide-react";
import { resetPassword, clearError, clearStatus } from "../../features/auth/authSlice";
import AuthCard from "../../components/auth/AuthCard";
import FormField from "../../components/auth/FormField";
import PasswordInput from "../../components/auth/PasswordInput";
import PasswordStrength from "../../components/auth/PasswordStrength";
import Button from "../../components/common/Button";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, resetStatus } = useSelector((s) => s.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password", "");

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearStatus());
    };
  }, [dispatch]);

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const result = await dispatch(resetPassword({ token, password: data.password }));
    if (resetPassword.fulfilled.match(result)) {
      toast.success("Password reset! Please log in with your new password.");
    }
  };

  return (
    <AuthCard title="Set new password" subtitle="Choose a strong password for your account.">
      <AnimatePresence mode="wait">
        {resetStatus === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 py-4 text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
              <ShieldCheck size={26} />
            </div>
            <h3 className="font-semibold text-gray-900">Password reset successful!</h3>
            <p className="text-sm text-gray-500">
              Your password has been updated. All other sessions have been signed out for your security.
            </p>
            <Button className="mt-2 w-full" onClick={() => navigate("/login")}>
              Log In
            </Button>
          </motion.div>
        ) : resetStatus === "error" ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4 py-4 text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-500">
              <AlertCircle size={26} />
            </div>
            <h3 className="font-semibold text-gray-900">Link expired or invalid</h3>
            <p className="text-sm text-gray-500">
              This password reset link is no longer valid. Please request a new one.
            </p>
            <Link to="/forgot-password" className="btn-primary mt-2 w-full text-center">
              Request New Link
            </Link>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <FormField label="New Password" error={errors.password?.message}>
              <PasswordInput
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                  pattern: { value: /\d/, message: "Must contain at least one number" },
                })}
              />
              <PasswordStrength password={password} />
            </FormField>

            <FormField label="Confirm Password" error={errors.confirmPassword?.message}>
              <PasswordInput
                placeholder="Repeat your new password"
                autoComplete="new-password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (val) => val === password || "Passwords do not match",
                })}
              />
            </FormField>

            <Button type="submit" loading={loading} className="w-full">
              Reset Password
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthCard>
  );
};

export default ResetPasswordPage;
