import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import { fetchJobs, createJob, updateJob, deleteJob } from "../../features/jobs/jobSlice";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";

const statusColors = {
  saved: "bg-gray-100 text-gray-700",
  applied: "bg-blue-100 text-blue-700",
  interviewing: "bg-amber-100 text-amber-700",
  offer: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const JobTrackerPage = () => {
  const dispatch = useDispatch();
  const { jobs, loading } = useSelector((state) => state.jobs);
  const { register, handleSubmit, reset } = useForm();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const onSubmit = async (data) => {
    const result = await dispatch(createJob(data));
    if (createJob.fulfilled.match(result)) {
      toast.success("Job application added");
      reset();
      setShowForm(false);
    } else {
      toast.error(result.payload || "Failed to add job");
    }
  };

  const handleStatusChange = (id, status) => {
    dispatch(updateJob({ id, status }));
  };

  const handleDelete = (id) => {
    dispatch(deleteJob(id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Application Tracker</h1>
          <p className="text-sm text-gray-500">Keep track of every opportunity in one place.</p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)}>
          <Plus size={16} /> Add Application
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="card grid gap-4 sm:grid-cols-2">
          <input className="input-field" placeholder="Company" {...register("company", { required: true })} />
          <input className="input-field" placeholder="Role" {...register("role", { required: true })} />
          <select className="input-field" {...register("status")}>
            <option value="saved">Saved</option>
            <option value="applied">Applied</option>
            <option value="interviewing">Interviewing</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
          <input className="input-field" placeholder="Job Link (optional)" {...register("jobLink")} />
          <textarea
            className="input-field sm:col-span-2"
            placeholder="Notes (optional)"
            {...register("notes")}
          />
          <div className="sm:col-span-2">
            <Button type="submit" loading={loading} className="w-full">
              Save Application
            </Button>
          </div>
        </form>
      )}

      {jobs.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Start tracking your job applications to stay organized."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-3">Company</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Applied</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id} className="border-t border-gray-100">
                  <td className="px-6 py-4 font-medium text-gray-900">{job.company}</td>
                  <td className="px-6 py-4 text-gray-600">{job.role}</td>
                  <td className="px-6 py-4">
                    <select
                      value={job.status}
                      onChange={(e) => handleStatusChange(job._id, e.target.value)}
                      className={`rounded-full border-0 px-3 py-1 text-xs font-semibold ${statusColors[job.status]}`}
                    >
                      <option value="saved">Saved</option>
                      <option value="applied">Applied</option>
                      <option value="interviewing">Interviewing</option>
                      <option value="offer">Offer</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(job.appliedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(job._id)} className="text-gray-400 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default JobTrackerPage;
