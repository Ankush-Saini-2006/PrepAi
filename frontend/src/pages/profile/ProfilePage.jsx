import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Camera, AlertTriangle, LogOut, ShieldOff } from "lucide-react";
import {
  updateProfile,
  changePassword,
  uploadAvatar,
  logoutAllDevices,
  resendVerification,
} from "../../features/auth/authSlice";
import FormField from "../../components/auth/FormField";
import PasswordInput from "../../components/auth/PasswordInput";
import PasswordStrength from "../../components/auth/PasswordStrength";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";

// ─── Section card wrapper ───────────────────────────────────────────────────
const Section = ({ title, subtitle, children }) => (
  <section className="card space-y-6">
    <div className="border-b border-gray-100 pb-4">
      <h2 className="font-semibold text-gray-900">{title}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
    </div>
    {children}
  </section>
);

// ─── Unverified banner ──────────────────────────────────────────────────────
const VerifyBanner = ({ email, onResend, loading }) => (
  <motion.div
    initial={{ opacity: 0, y: -6 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4"
  >
    <div className="flex items-center gap-3 text-amber-800">
      <AlertTriangle size={18} className="shrink-0" />
      <p className="text-sm">
        <span className="font-semibold">Your email is not verified.</span> Some features are
        restricted until you verify <span className="font-medium">{email}</span>.
      </p>
    </div>
    <Button
      variant="secondary"
      loading={loading}
      onClick={onResend}
      className="!py-1.5 !px-4 text-xs shrink-0"
    >
      Resend Email
    </Button>
  </motion.div>
);

// ─── Avatar uploader ────────────────────────────────────────────────────────
const AvatarUploader = ({ user, onUpload, loading }) => {
  const fileRef = useRef();
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }
    onUpload(file);
  };

  return (
    <div className="flex items-center gap-5">
      <div className="relative h-20 w-20">
        {user?.avatar?.url ? (
          <img
            src={user.avatar.url}
            alt={user.name}
            className="h-20 w-20 rounded-full object-cover ring-4 ring-primary-100"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-700 ring-4 ring-primary-50">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}
        <button
          type="button"
          disabled={loading}
          onClick={() => fileRef.current?.click()}
          className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-white shadow hover:bg-primary-700 disabled:opacity-50"
        >
          <Camera size={13} />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleFile}
        />
      </div>
      <div>
        <p className="font-medium text-gray-900">{user?.name}</p>
        <p className="text-sm text-gray-500">{user?.email}</p>
        {user?.isVerified ? (
          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
            ✓ Verified
          </span>
        ) : (
          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
            ⚠ Not verified
          </span>
        )}
      </div>
    </div>
  );
};

// ─── Main page ──────────────────────────────────────────────────────────────
const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const authLoading = useSelector((s) => s.auth.loading);

  const [resendingVerification, setResendingVerification] = useState(false);

  // Profile form
  const {
    register: regProfile,
    handleSubmit: handleProfile,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      targetRole: user?.targetRole || "",
      skills: user?.skills?.join(", ") || "",
      role: user?.role || "student",
    },
  });

  // Password form
  const {
    register: regPwd,
    handleSubmit: handlePwd,
    watch,
    reset: resetPwd,
    formState: { errors: pwdErrors, isSubmitting: pwdSubmitting },
  } = useForm();

  const newPassword = watch("newPassword", "");

  // ── Handlers ──────────────────────────────────────────────────────────────
  const onProfileSave = async (data) => {
    const result = await dispatch(
      updateProfile({
        name: data.name,
        targetRole: data.targetRole,
        role: data.role,
        skills: data.skills,
      })
    );
    if (updateProfile.fulfilled.match(result)) {
      toast.success("Profile updated");
    } else {
      toast.error(result.payload || "Update failed");
    }
  };

  const onPasswordChange = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const result = await dispatch(
      changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
    );
    if (changePassword.fulfilled.match(result)) {
      toast.success("Password changed. Please log in again.");
      navigate("/login");
    } else {
      toast.error(result.payload || "Password change failed");
    }
  };

  const onAvatarUpload = async (file) => {
    const result = await dispatch(uploadAvatar(file));
    if (uploadAvatar.fulfilled.match(result)) {
      toast.success("Avatar updated");
    } else {
      toast.error(result.payload || "Upload failed");
    }
  };

  const handleResendVerification = async () => {
    setResendingVerification(true);
    const result = await dispatch(resendVerification(user?.email));
    setResendingVerification(false);
    if (resendVerification.fulfilled.match(result)) {
      toast.success("Verification email sent! Check your inbox.");
    } else {
      toast.error(result.payload || "Failed to send email");
    }
  };

  const handleLogoutAll = async () => {
    const result = await dispatch(logoutAllDevices());
    if (logoutAllDevices.fulfilled.match(result)) {
      toast.success("Signed out from all devices");
      navigate("/login");
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-sm text-gray-500">Manage your profile, password and sessions.</p>
      </div>

      {/* Unverified banner */}
      {user && !user.isVerified && (
        <VerifyBanner
          email={user.email}
          onResend={handleResendVerification}
          loading={resendingVerification}
        />
      )}

      {/* ── Profile Section ──────────────────────────────────────────────── */}
      <Section title="Profile" subtitle="Update your personal and career information.">
        <AvatarUploader user={user} onUpload={onAvatarUpload} loading={authLoading} />

        <form onSubmit={handleProfile(onProfileSave)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Full Name" error={profileErrors.name?.message}>
              <input
                className="input-field"
                placeholder="John Doe"
                {...regProfile("name", { required: "Name is required" })}
              />
            </FormField>

            <FormField label="I am a">
              <select className="input-field" {...regProfile("role")}>
                <option value="student">Student / Fresher</option>
                <option value="professional">Working Professional</option>
              </select>
            </FormField>
          </div>

          <FormField label="Email address">
            <input
              className="input-field bg-gray-50 cursor-not-allowed"
              value={user?.email || ""}
              disabled
            />
          </FormField>

          <FormField label="Target Role" error={profileErrors.targetRole?.message}>
            <input
              className="input-field"
              placeholder="e.g. Full Stack Developer"
              {...regProfile("targetRole")}
            />
          </FormField>

          <FormField
            label="Skills"
            hint="Comma-separated: React, Node.js, Python…"
            error={profileErrors.skills?.message}
          >
            <input
              className="input-field"
              placeholder="React, Node.js, MongoDB"
              {...regProfile("skills")}
            />
          </FormField>

          <Button type="submit" loading={profileSubmitting}>
            Save Profile
          </Button>
        </form>
      </Section>

      {/* ── Change Password Section ──────────────────────────────────────── */}
      <Section
        title="Change Password"
        subtitle="Changing your password will sign you out from all devices."
      >
        <form onSubmit={handlePwd(onPasswordChange)} className="space-y-4">
          <FormField label="Current Password" error={pwdErrors.currentPassword?.message}>
            <PasswordInput
              placeholder="Your current password"
              autoComplete="current-password"
              {...regPwd("currentPassword", { required: "Current password is required" })}
            />
          </FormField>

          <FormField label="New Password" error={pwdErrors.newPassword?.message}>
            <PasswordInput
              placeholder="Min. 6 characters"
              autoComplete="new-password"
              {...regPwd("newPassword", {
                required: "New password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
                pattern: { value: /\d/, message: "Must contain at least one number" },
              })}
            />
            <PasswordStrength password={newPassword} />
          </FormField>

          <FormField label="Confirm New Password" error={pwdErrors.confirmPassword?.message}>
            <PasswordInput
              placeholder="Repeat your new password"
              autoComplete="new-password"
              {...regPwd("confirmPassword", {
                required: "Please confirm your password",
                validate: (val) => val === newPassword || "Passwords do not match",
              })}
            />
          </FormField>

          <Button type="submit" loading={pwdSubmitting} variant="secondary">
            Change Password
          </Button>
        </form>
      </Section>

      {/* ── Sessions / Security Section ──────────────────────────────────── */}
      <Section
        title="Sessions & Security"
        subtitle="Manage active sessions across all your devices."
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-800">Sign out from all devices</p>
            <p className="mt-0.5 text-xs text-gray-500">
              This revokes all active sessions. You will be redirected to the login page.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={handleLogoutAll}
            className="shrink-0 !text-red-600 hover:!bg-red-50"
          >
            <ShieldOff size={15} />
            Logout All
          </Button>
        </div>
      </Section>
    </div>
  );
};

export default ProfilePage;
