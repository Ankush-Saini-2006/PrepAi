import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AIPlannerCard from "../../components/SmartTasks/AIPlannerCard";
import DashboardCard from "../../components/dashboard/DashboardCard";
import TaskList from "../../components/SmartTasks/TaskList";
import { generateAIStudyPlan, setActiveTask } from "../../redux/slices/taskSlice";

const initialForm = {
  targetCompany: "",
  targetRole: "",
  currentSkills: "",
  availableHoursPerDay: 2,
  deadline: "",
  careerGoal: "",
};

const AIPlanner = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activeStudyPlan, generating } = useSelector((state) => state.tasks);
  const [form, setForm] = useState(initialForm);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.deadline) return toast.error("Deadline is required");

    const result = await dispatch(
      generateAIStudyPlan({
        ...form,
        currentSkills: form.currentSkills.split(",").map((skill) => skill.trim()).filter(Boolean),
        availableHoursPerDay: Number(form.availableHoursPerDay) || 2,
      })
    );

    if (generateAIStudyPlan.fulfilled.match(result)) {
      toast.success("AI study plan generated");
      navigate("/dashboard/tasks/study-plan");
    } else {
      toast.error(result.payload || "Plan generation failed");
    }
  };

  const handleSelectTask = (task) => {
    dispatch(setActiveTask(task));
    navigate(`/dashboard/tasks/${task._id}`);
  };

  return (
    <div className="space-y-6">
      <AIPlannerCard
        form={form}
        loading={generating}
        onChange={(key, value) => setForm((current) => ({ ...current, [key]: value }))}
        onSubmit={handleSubmit}
      />
      {activeStudyPlan ? (
        <DashboardCard subtitle="Latest AI plan" title={activeStudyPlan.title}>
          <p className="mb-4 text-sm leading-6 theme-text-muted">{activeStudyPlan.summary}</p>
          <TaskList tasks={activeStudyPlan.tasks || []} onSelect={handleSelectTask} />
        </DashboardCard>
      ) : null}
    </div>
  );
};

export default AIPlanner;
