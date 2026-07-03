import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CalendarDays, Clock3, ListTodo, Plus, Sparkles } from "lucide-react";
import Button from "../../components/common/Button";
import DashboardCard from "../../components/dashboard/DashboardCard";
import MetricCard from "../../components/dashboard/MetricCard";
import DeadlineCard from "../../components/SmartTasks/DeadlineCard";
import ProgressCard from "../../components/SmartTasks/ProgressCard";
import ReminderCard from "../../components/SmartTasks/ReminderCard";
import TaskList from "../../components/SmartTasks/TaskList";
import {
  completeTask,
  createTask,
  deleteTask,
  fetchTaskProgress,
  fetchTaskStats,
  fetchTasks,
  setActiveTask,
} from "../../redux/slices/taskSlice";

const categories = [
  "DSA",
  "Frontend",
  "Backend",
  "System Design",
  "Core Subjects",
  "SQL",
  "JavaScript",
  "Aptitude",
  "Resume",
  "Projects",
  "Company Preparation",
  "Revision",
  "Custom",
];

const initialForm = {
  title: "",
  description: "",
  category: "DSA",
  priority: "Medium",
  status: "Pending",
  dueDate: "",
  estimatedStudyMinutes: 60,
  notes: "",
  reminderAt: "",
  recurring: "None",
  company: "",
  careerGoal: "",
};

const chartTooltipStyle = {
  backgroundColor: "var(--page-surface-solid)",
  border: "1px solid var(--page-border)",
  borderRadius: "16px",
  color: "var(--page-text)",
};

const TaskDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tasks, stats, progress, loading } = useSelector((state) => state.tasks);
  const [view, setView] = useState("today");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    dispatch(fetchTasks({ view }));
    dispatch(fetchTaskStats());
    dispatch(fetchTaskProgress());
  }, [dispatch, view]);

  const nextReminder = useMemo(
    () =>
      tasks
        .filter((task) => task.reminderAt && task.status !== "Completed")
        .sort((left, right) => new Date(left.reminderAt) - new Date(right.reminderAt))[0],
    [tasks]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) return toast.error("Task title is required");
    if (!form.dueDate) return toast.error("Deadline is required");

    const result = await dispatch(createTask(form));
    if (createTask.fulfilled.match(result)) {
      toast.success("Task created");
      setForm(initialForm);
      setShowForm(false);
      dispatch(fetchTaskStats());
      dispatch(fetchTaskProgress());
    } else {
      toast.error(result.payload || "Task creation failed");
    }
  };

  const handleComplete = async (task) => {
    const result = await dispatch(completeTask({ id: task._id, actualStudyMinutes: task.estimatedStudyMinutes }));
    if (completeTask.fulfilled.match(result)) {
      toast.success(result.payload.status === "Completed" ? "Task completed" : "Task reopened");
      dispatch(fetchTaskStats());
      dispatch(fetchTaskProgress());
    }
  };

  const handleDelete = async (id) => {
    const result = await dispatch(deleteTask(id));
    if (deleteTask.fulfilled.match(result)) toast.success("Task deleted");
  };

  const handleSelect = (task) => {
    dispatch(setActiveTask(task));
    navigate(`/dashboard/tasks/${task._id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600 dark:text-violet-300">AI Smart Task Manager</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--page-text)]">Placement preparation planner</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 theme-text-muted">Plan daily tasks, track deadlines, and generate study schedules with Gemini.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={() => navigate("/dashboard/tasks/ai-planner")}>
            <Sparkles size={16} /> AI planner
          </Button>
          <Button type="button" onClick={() => setShowForm((value) => !value)}>
            <Plus size={16} /> Add task
          </Button>
        </div>
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="card grid gap-3 md:grid-cols-2">
          <input className="input-field" placeholder="Task title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          <select className="input-field" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
          <select className="input-field" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>
            {["Low", "Medium", "High", "Critical"].map((priority) => <option key={priority} value={priority}>{priority}</option>)}
          </select>
          <input className="input-field" type="datetime-local" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} />
          <input className="input-field" type="number" min="0" value={form.estimatedStudyMinutes} onChange={(event) => setForm({ ...form, estimatedStudyMinutes: Number(event.target.value) })} />
          <input className="input-field" type="datetime-local" value={form.reminderAt} onChange={(event) => setForm({ ...form, reminderAt: event.target.value })} />
          <input className="input-field" placeholder="Company" value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} />
          <select className="input-field" value={form.recurring} onChange={(event) => setForm({ ...form, recurring: event.target.value })}>
            {["None", "Daily", "Weekly", "Monthly"].map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <textarea className="input-field md:col-span-2" placeholder="Description or notes" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          <div className="md:col-span-2">
            <Button type="submit" loading={loading} className="w-full">Save task</Button>
          </div>
        </form>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={ListTodo} title="Pending Tasks" value={stats?.pendingTasks ?? 0} description="Open preparation tasks" loading={loading} />
        <MetricCard icon={Clock3} title="Study Hours" value={stats?.studyHours ?? 0} description="Tracked completed effort" loading={loading} />
        <ProgressCard title="Completion" value={stats?.progress ?? progress?.summary?.completionPercentage ?? 0} detail="Overall task completion" />
        <MetricCard icon={CalendarDays} title="Today's Goal" value={stats?.todaysGoal || "No goal"} description="First task due today" loading={loading} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <DeadlineCard task={stats?.upcomingDeadline} />
        <ReminderCard task={nextReminder} />
        <ProgressCard title="Weekly Progress" value={progress?.summary?.weeklyProgress ?? 0} detail="Tasks completed this week" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <DashboardCard
          subtitle="Focus views"
          title="Task list"
          action={
            <select className="input-field !w-auto" value={view} onChange={(event) => setView(event.target.value)}>
              {["today", "tomorrow", "week", "month", "overdue", "completed"].map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          }
        >
          <TaskList tasks={tasks} onSelect={handleSelect} onComplete={handleComplete} onDelete={handleDelete} />
        </DashboardCard>

        <DashboardCard subtitle="Progress charts" title="Study momentum">
          <div className="space-y-5">
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progress?.charts?.dailyProgress || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--page-border)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: "var(--page-text-soft)", fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: "var(--page-text-soft)", fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Area type="monotone" dataKey="completion" stroke="#6366f1" fill="#6366f133" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={progress?.charts?.categoryDistribution || []} dataKey="value" nameKey="name" innerRadius={46} outerRadius={76}>
                    {(progress?.charts?.categoryDistribution || []).map((entry, index) => <Cell key={entry.name} fill={["#6366f1", "#8b5cf6", "#06b6d4", "#22c55e", "#f59e0b"][index % 5]} />)}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={progress?.charts?.studyHours || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--page-border)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: "var(--page-text-soft)", fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: "var(--page-text-soft)", fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Bar dataKey="hours" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default TaskDashboard;
