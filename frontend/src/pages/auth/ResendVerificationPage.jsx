import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { MailCheck } from "lucide-react";
import { resendVerification, clearError, clearEmailSent } from "../../features/auth/authSlice";
import AuthCard from "../../components/auth/AuthCard";
import FormField from "../../components/auth/FormField";
import Button from "../../components/common/Button";

const ResendVerificationPage = () => {
  const dispatch = useDispatch();
  const { loading, error, emailSent } = useSelector((s) => s.auth);
  const { register, handleSubmit, getValues, formState: { errors } } = useForm();

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearEmailSent());
    };
  }, [dispatch]);

  const onSubmit = async (data) => {
    const result = await dispatch(resendVerification(data.email));
    if (resendVerification.rejected.match(result)) {
      toast.error(result.payload || "Something went wrong");
    }
  };

  return (
    <AuthCard
      title="Resend Verification Email"
      subtitle="Enter your email and we'll resend the verification link."
    >
      <AnimatePresence mode="wait">
        {emailSent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 py-4 text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
              <MailCheck size={26} />
            </div>
            <h3 className="font-semibold text-gray-900">Email sent!</h3>
            <p className="text-sm text-gray-500">
              A new verification link has been sent to{" "}
              <span className="font-medium text-gray-700">{getValues("email")}</span>.{" "}
              The link expires in 24 hours.
            </p>
            <Link to="/login" className="mt-2 text-sm font-medium text-primary-600 hover:underline">
              ← Back to login
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

            <FormField label="Email address" error={errors.email?.message}>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                autoComplete="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
                })}
              />
            </FormField>

            <Button type="submit" loading={loading} className="w-full">
              Resend Verification Email
            </Button>

            <Link
              to="/login"
              className="block text-center text-sm text-gray-500 hover:text-primary-600"
            >
              ← Back to login
            </Link>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthCard>
  );
};

export default ResendVerificationPage;
