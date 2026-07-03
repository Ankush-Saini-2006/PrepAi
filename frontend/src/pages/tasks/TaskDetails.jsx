import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import DashboardCard from "../../components/dashboard/DashboardCard";
import PriorityBadge from "../../components/SmartTasks/PriorityBadge";
import { completeTask, deleteTask, fetchTaskById, updateTask } from "../../redux/slices/taskSlice";

const TaskDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeTask, loading } = useSelector((state) => state.tasks);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    dispatch(fetchTaskById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (activeTask) {
      setNotes(activeTask.notes || "");
      setStatus(activeTask.status || "Pending");
    }
  }, [activeTask]);

  const handleSave = async () => {
    const result = await dispatch(updateTask({ id, notes, status }));
    if (updateTask.fulfilled.match(result)) toast.success("Task updated");
  };

  const handleComplete = async () => {
    const result = await dispatch(completeTask({ id, actualStudyMinutes: activeTask?.estimatedStudyMinutes }));
    if (completeTask.fulfilled.match(result)) toast.success("Task completion updated");
  };

  const handleDelete = async () => {
    const result = await dispatch(deleteTask(id));
    if (deleteTask.fulfilled.match(result)) {
      toast.success("Task deleted");
      navigate("/dashboard/tasks");
    }
  };

  if (!activeTask) {
    return <DashboardCard title="Task details"><p className="text-sm theme-text-muted">{loading ? "Loading task..." : "Task not found."}</p></DashboardCard>;
  }

  return (
    <div className="space-y-6">
      <DashboardCard
        subtitle={activeTask.category}
        title={activeTask.title}
        action={<PriorityBadge priority={activeTask.priority} />}
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_0.7fr]">
          <div className="space-y-4">
            <p className="text-sm leading-6 theme-text-muted">{activeTask.description || "No description provided."}</p>
            <textarea className="input-field min-h-40" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Task notes" />
          </div>
          <div className="space-y-3 rounded-2xl bg-[var(--page-surface-soft)] p-4 text-sm">
            <p><span className="font-semibold text-[color:var(--page-text)]">Deadline:</span> <span className="theme-text-muted">{new Date(activeTask.dueDate).toLocaleString()}</span></p>
            <p><span className="font-semibold text-[color:var(--page-text)]">Estimated study:</span> <span className="theme-text-muted">{activeTask.estimatedStudyMinutes} minutes</span></p>
            <p><span className="font-semibold text-[color:var(--page-text)]">Reminder:</span> <span className="theme-text-muted">{activeTask.reminderAt ? new Date(activeTask.reminderAt).toLocaleString() : "None"}</span></p>
            <p><span className="font-semibold text-[color:var(--page-text)]">Recurring:</span> <span className="theme-text-muted">{activeTask.recurring}</span></p>
            <select className="input-field" value={status} onChange={(event) => setStatus(event.target.value)}>
              {["Pending", "In Progress", "Completed", "Missed"].map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
        </div>
      </DashboardCard>

      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={handleSave}>Save changes</Button>
        <Button type="button" variant="secondary" onClick={handleComplete}>Toggle complete</Button>
        <Button type="button" variant="secondary" onClick={handleDelete}>Delete task</Button>
      </div>
    </div>
  );
};

export default TaskDetails;
