import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser, clearError } from "../../features/auth/authSlice";
import AuthCard from "../../components/auth/AuthCard";
import FormField from "../../components/auth/FormField";
import PasswordInput from "../../components/auth/PasswordInput";
import PasswordStrength from "../../components/auth/PasswordStrength";
import Button from "../../components/common/Button";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { role: "student" } });

  const password = watch("password", "");

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      toast.success("Account created! Check your email to verify.");
      navigate("/dashboard");
    } else {
      toast.error(result.payload || "Registration failed");
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start your AI-powered career prep journey."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Server error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <FormField label="Full Name" error={errors.name?.message}>
          <input
            className="input-field"
            placeholder="John Doe"
            {...register("name", {
              required: "Name is required",
              maxLength: { value: 60, message: "Max 60 characters" },
            })}
          />
        </FormField>

        <FormField label="Email address" error={errors.email?.message}>
          <input
            type="email"
            className="input-field"
            placeholder="you@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
            })}
          />
        </FormField>

        <FormField label="Password" error={errors.password?.message}>
          <PasswordInput
            placeholder="Min. 6 characters"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
              pattern: { value: /\d/, message: "Must contain at least one number" },
            })}
          />
          <PasswordStrength password={password} />
        </FormField>

        <FormField label="I am a" error={errors.role?.message}>
          <select className="input-field" {...register("role")}>
            <option value="student">Student / Fresher</option>
            <option value="professional">Working Professional</option>
          </select>
        </FormField>

        <FormField label="Target Role" error={errors.targetRole?.message}>
          <input
            className="input-field"
            placeholder="e.g. Full Stack Developer"
            {...register("targetRole")}
          />
        </FormField>

        <Button type="submit" loading={loading} className="w-full">
          Create Account
        </Button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </AuthCard>
  );
};

export default RegisterPage;
