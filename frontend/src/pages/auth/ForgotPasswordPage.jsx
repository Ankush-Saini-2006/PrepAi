import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Button from "../../components/common/Button";

const ForgotPasswordPage = () => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axiosInstance.post("/auth/forgot-password", data);
      setSent(true);
      toast.success("Reset link sent! Check your email.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900">Reset your password</h2>
        <p className="mt-1 text-sm text-gray-500">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        {sent ? (
          <p className="mt-6 rounded-xl bg-green-50 p-4 text-sm text-green-700">
            If an account exists with that email, a reset link has been sent.
          </p>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <input
              type="email"
              className="input-field"
              placeholder="you@example.com"
              {...register("email", { required: true })}
            />
            <Button type="submit" loading={loading} className="w-full">
              Send Reset Link
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
