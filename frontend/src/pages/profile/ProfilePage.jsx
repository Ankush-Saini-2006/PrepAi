import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import axiosInstance from "../../utils/axiosInstance";
import { fetchCurrentUser } from "../../features/auth/authSlice";
import Button from "../../components/common/Button";

const ProfilePage = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      name: user?.name,
      targetRole: user?.targetRole,
      skills: user?.skills?.join(", "),
      role: user?.role,
    },
  });

  const onSubmit = async (data) => {
    try {
      await axiosInstance.put("/users/profile", data);
      dispatch(fetchCurrentUser());
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-sm text-gray-500">Update your personal and career information.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
          <input className="input-field" {...register("name")} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input className="input-field bg-gray-50" value={user?.email} disabled />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">I am a</label>
          <select className="input-field" {...register("role")}>
            <option value="student">Student</option>
            <option value="professional">Professional</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Target Role</label>
          <input className="input-field" placeholder="e.g. Full Stack Developer" {...register("targetRole")} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Skills (comma separated)</label>
          <input className="input-field" placeholder="React, Node.js, MongoDB" {...register("skills")} />
        </div>
        <Button type="submit" loading={isSubmitting}>
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default ProfilePage;
