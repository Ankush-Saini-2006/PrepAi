import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { AlertTriangle, Camera, Download, Plus, ShieldOff, Trash2, Upload } from "lucide-react";
import {
  updateProfile,
  changePassword,
  uploadAvatar,
  uploadProfileResume,
  deleteProfileResume,
  logoutAllDevices,
  resendVerification,
} from "../../features/auth/authSlice";
import FormField from "../../components/auth/FormField";
import PasswordInput from "../../components/auth/PasswordInput";
import PasswordStrength from "../../components/auth/PasswordStrength";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";
import axiosInstance from "../../utils/axiosInstance";

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

const emptyProject = { title: "", description: "", techStack: "", link: "", githubUrl: "" };
const emptyCertificate = { title: "", issuer: "", credentialUrl: "", issuedAt: "" };
const emptyAchievement = { title: "", description: "", date: "" };

const toDateInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

const listToText = (value) => (Array.isArray(value) ? value.join(", ") : value || "");

const ProfileItemEditor = ({ title, items, emptyItem, fields, onChange, addLabel }) => {
  const updateItem = (index, key, value) => {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)));
  };

  const removeItem = (index) => {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-gray-800">{title}</p>
        <Button type="button" variant="secondary" className="!px-3 !py-1.5 text-xs" onClick={() => onChange([...items, emptyItem])}>
          <Plus size={14} /> {addLabel}
        </Button>
      </div>
      {items.map((item, index) => (
        <div key={index} className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((field) => (
              <FormField key={field.key} label={field.label} hint={field.hint}>
                {field.type === "textarea" ? (
                  <textarea
                    className="input-field"
                    placeholder={field.placeholder}
                    value={item[field.key] || ""}
                    onChange={(event) => updateItem(index, field.key, event.target.value)}
                  />
                ) : (
                  <input
                    className="input-field"
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    value={item[field.key] || ""}
                    onChange={(event) => updateItem(index, field.key, event.target.value)}
                  />
                )}
              </FormField>
            ))}
          </div>
          <Button type="button" variant="secondary" className="mt-3 !px-3 !py-1.5 text-xs !text-red-600 hover:!bg-red-50" onClick={() => removeItem(index)}>
            <Trash2 size={14} /> Delete
          </Button>
        </div>
      ))}
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
  const resumeRef = useRef();
  const [careerGoals, setCareerGoals] = useState([]);
  const [goalInput, setGoalInput] = useState("");
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [codingProfiles, setCodingProfiles] = useState({
    leetcode: "",
    github: "",
    codeforces: "",
    codechef: "",
    geeksforgeeks: "",
    hackerrank: "",
  });

  useEffect(() => {
    if (!user) return;
    setCareerGoals(user.careerGoals || []);
    setProjects((user.projects || []).map((project) => ({ ...project, techStack: listToText(project.techStack) })));
    setCertificates((user.certificates || []).map((certificate) => ({ ...certificate, issuedAt: toDateInput(certificate.issuedAt) })));
    setAchievements((user.achievements || []).map((achievement) => ({ ...achievement, date: toDateInput(achievement.date) })));
    setCodingProfiles({
      leetcode: user.codingProfiles?.leetcode || "",
      github: user.codingProfiles?.github || "",
      codeforces: user.codingProfiles?.codeforces || "",
      codechef: user.codingProfiles?.codechef || "",
      geeksforgeeks: user.codingProfiles?.geeksforgeeks || "",
      hackerrank: user.codingProfiles?.hackerrank || "",
    });
  }, [user]);

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
        careerGoals,
        projects: projects.map((project) => ({
          ...project,
          techStack: project.techStack.split(",").map((skill) => skill.trim()).filter(Boolean),
        })),
        certificates,
        achievements,
        codingProfiles,
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

  const onResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("Resume must be under 5 MB");
    const result = await dispatch(uploadProfileResume(file));
    if (uploadProfileResume.fulfilled.match(result)) {
      toast.success("Resume uploaded");
    } else {
      toast.error(result.payload || "Resume upload failed");
    }
    event.target.value = "";
  };

  const handleResumeDelete = async () => {
    const result = await dispatch(deleteProfileResume());
    if (deleteProfileResume.fulfilled.match(result)) {
      toast.success("Resume removed");
    } else {
      toast.error(result.payload || "Resume delete failed");
    }
  };

  const handleResumeDownload = async () => {
    try {
      const response = await axiosInstance.get("/users/resume/download", { responseType: "blob" });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = user?.profileResume?.originalName || "resume";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      toast.error(err.response?.data?.message || "Resume download failed");
    }
  };

  const addCareerGoal = () => {
    const goal = goalInput.trim();
    if (!goal) return;
    setCareerGoals((current) => [...current, goal]);
    setGoalInput("");
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

      <Section title="Resume" subtitle="Upload, replace, download, or remove the resume attached to your profile.">
        <input ref={resumeRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={onResumeUpload} />
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-gray-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800">{user?.profileResume?.originalName || "No resume uploaded"}</p>
            <p className="mt-0.5 text-xs text-gray-500">
              {user?.profileResume?.uploadedAt ? `Uploaded ${new Date(user.profileResume.uploadedAt).toLocaleDateString()}` : "PDF, DOC, or DOCX under 5 MB."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={() => resumeRef.current?.click()} loading={authLoading}>
              <Upload size={15} /> {user?.profileResume?.url ? "Replace" : "Upload"}
            </Button>
            {user?.profileResume?.url ? (
              <>
                <Button type="button" variant="secondary" onClick={handleResumeDownload}>
                  <Download size={15} /> Download
                </Button>
                <Button type="button" variant="secondary" className="!text-red-600 hover:!bg-red-50" onClick={handleResumeDelete} loading={authLoading}>
                  <Trash2 size={15} /> Delete
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </Section>

      <Section title="Career Goals" subtitle="Track the roles and outcomes you are preparing for.">
        <div className="flex gap-2">
          <input className="input-field" placeholder="e.g. Crack a backend SDE role at a product company" value={goalInput} onChange={(event) => setGoalInput(event.target.value)} />
          <Button type="button" variant="secondary" onClick={addCareerGoal}>
            <Plus size={15} /> Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {careerGoals.map((goal, index) => (
            <span key={`${goal}-${index}`} className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
              {goal}
              <button type="button" onClick={() => setCareerGoals(careerGoals.filter((_, goalIndex) => goalIndex !== index))} className="text-primary-500 hover:text-red-600">
                x
              </button>
            </span>
          ))}
        </div>
      </Section>

      <Section title="Coding Profiles" subtitle="Save handles for coding and developer platforms.">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["leetcode", "LeetCode"],
            ["github", "GitHub"],
            ["codeforces", "Codeforces"],
            ["codechef", "CodeChef"],
            ["geeksforgeeks", "GeeksforGeeks"],
            ["hackerrank", "HackerRank"],
          ].map(([key, label]) => (
            <FormField key={key} label={label}>
              <input className="input-field" placeholder={`${label} username`} value={codingProfiles[key]} onChange={(event) => setCodingProfiles((current) => ({ ...current, [key]: event.target.value }))} />
            </FormField>
          ))}
        </div>
      </Section>

      <Section title="Projects" subtitle="Add, edit, or delete projects shown in your profile.">
        <ProfileItemEditor
          title="Projects"
          items={projects}
          emptyItem={emptyProject}
          addLabel="Add Project"
          onChange={setProjects}
          fields={[
            { key: "title", label: "Project Title", placeholder: "Prep dashboard" },
            { key: "techStack", label: "Tech Stack", placeholder: "React, Node.js, MongoDB", hint: "Comma-separated" },
            { key: "link", label: "Live Link", placeholder: "https://..." },
            { key: "githubUrl", label: "GitHub URL", placeholder: "https://github.com/..." },
            { key: "description", label: "Description", placeholder: "What did you build?", type: "textarea" },
          ]}
        />
      </Section>

      <Section title="Certificates" subtitle="Add, edit, or delete certificates.">
        <ProfileItemEditor
          title="Certificates"
          items={certificates}
          emptyItem={emptyCertificate}
          addLabel="Add Certificate"
          onChange={setCertificates}
          fields={[
            { key: "title", label: "Certificate Title", placeholder: "Full Stack Development" },
            { key: "issuer", label: "Issuer", placeholder: "Coursera, Udemy, NPTEL..." },
            { key: "credentialUrl", label: "Credential URL", placeholder: "https://..." },
            { key: "issuedAt", label: "Issued Date", type: "date" },
          ]}
        />
      </Section>

      <Section title="Achievements" subtitle="Add, edit, or delete academic, coding, and placement achievements.">
        <ProfileItemEditor
          title="Achievements"
          items={achievements}
          emptyItem={emptyAchievement}
          addLabel="Add Achievement"
          onChange={setAchievements}
          fields={[
            { key: "title", label: "Achievement Title", placeholder: "Top 5 in hackathon" },
            { key: "date", label: "Date", type: "date" },
            { key: "description", label: "Description", placeholder: "What was the outcome?", type: "textarea" },
          ]}
        />
        <Button type="button" loading={profileSubmitting} onClick={handleProfile(onProfileSave)}>
          Save Profile Details
        </Button>
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
