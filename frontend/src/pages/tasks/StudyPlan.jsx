import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import DashboardCard from "../../components/dashboard/DashboardCard";
import GoalCard from "../../components/SmartTasks/GoalCard";
import TaskList from "../../components/SmartTasks/TaskList";
import { deleteStudyPlan, fetchStudyPlans, fetchStudyPlanById, setActiveTask } from "../../redux/slices/taskSlice";

const StudyPlan = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { studyPlans, activeStudyPlan } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchStudyPlans());
  }, [dispatch]);

  const handleSelectTask = (task) => {
    dispatch(setActiveTask(task));
    navigate(`/dashboard/tasks/${task._id}`);
  };

  const handleDelete = async (id) => {
    const result = await dispatch(deleteStudyPlan(id));
    if (deleteStudyPlan.fulfilled.match(result)) toast.success("Study plan deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600 dark:text-violet-300">Study Plan</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--page-text)]">AI generated preparation plans</h1>
        </div>
        <Button type="button" onClick={() => navigate("/dashboard/tasks/ai-planner")}>Generate plan</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[18rem_1fr]">
        <DashboardCard subtitle="History" title="Plans">
          <div className="space-y-2">
            {studyPlans.map((plan) => (
              <button
                key={plan._id}
                type="button"
                onClick={() => dispatch(fetchStudyPlanById(plan._id))}
                className={`w-full rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                  activeStudyPlan?._id === plan._id ? "bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-violet-300" : "theme-text-muted hover:bg-[var(--page-surface-soft)]"
                }`}
              >
                <span className="block truncate">{plan.title}</span>
                <span className="mt-1 block text-xs theme-text-muted">{plan.daysRemaining} days remaining</span>
              </button>
            ))}
          </div>
        </DashboardCard>

        {activeStudyPlan ? (
          <div className="space-y-4">
            <DashboardCard
              subtitle={activeStudyPlan.targetCompany || activeStudyPlan.targetRole || "Preparation"}
              title={activeStudyPlan.title}
              action={<Button type="button" variant="secondary" onClick={() => handleDelete(activeStudyPlan._id)}>Delete</Button>}
            >
              <p className="text-sm leading-6 theme-text-muted">{activeStudyPlan.summary}</p>
            </DashboardCard>
            <div className="grid gap-4 md:grid-cols-3">
              <GoalCard title="Daily Goal" value={activeStudyPlan.dailyGoal} />
              <GoalCard title="Weekly Goal" value={activeStudyPlan.weeklyGoal} />
              <GoalCard title="Monthly Goal" value={activeStudyPlan.monthlyGoal} />
            </div>
            <DashboardCard subtitle="Revision Plan" title="Final preparation">
              <ul className="space-y-2 text-sm theme-text-muted">
                {(activeStudyPlan.revisionPlan || []).map((item, index) => (
                  <li key={`${item}-${index}`} className="rounded-xl bg-[var(--page-surface-soft)] px-3 py-2">{item}</li>
                ))}
              </ul>
            </DashboardCard>
            <DashboardCard subtitle="Generated Tasks" title="Task breakdown">
              <TaskList tasks={activeStudyPlan.tasks || []} onSelect={handleSelectTask} />
            </DashboardCard>
          </div>
        ) : (
          <DashboardCard title="No study plan selected">
            <p className="text-sm theme-text-muted">Generate or select a study plan to view its goals, milestones, revision plan, and tasks.</p>
          </DashboardCard>
        )}
      </div>
    </div>
  );
};

export default StudyPlan;
