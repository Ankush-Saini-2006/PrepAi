import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser, clearError } from "../../features/auth/authSlice";
import AuthCard from "../../components/auth/AuthCard";
import FormField from "../../components/auth/FormField";
import PasswordInput from "../../components/auth/PasswordInput";
import Button from "../../components/common/Button";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";
  const { loading, error } = useSelector((s) => s.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { rememberMe: false } });

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.user.name.split(" ")[0]}!`);
      navigate(from, { replace: true });
    } else {
      toast.error(result.payload || "Login failed");
    }
  };

  return (
    <AuthCard title="Welcome back" subtitle="Log in to continue your prep journey.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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

        <FormField label="Password" error={errors.password?.message}>
          <PasswordInput
            placeholder="Your password"
            autoComplete="current-password"
            {...register("password", { required: "Password is required" })}
          />
        </FormField>

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              {...register("rememberMe")}
            />
            Remember me for 30 days
          </label>
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-primary-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Log In
        </Button>

        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-semibold text-primary-600 hover:underline">
            Sign up free
          </Link>
        </p>
      </form>
    </AuthCard>
  );
};

export default LoginPage;
