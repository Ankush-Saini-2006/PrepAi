import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Calendar from "../../components/SmartTasks/Calendar";
import DashboardCard from "../../components/dashboard/DashboardCard";
import { fetchTasks, setActiveTask } from "../../redux/slices/taskSlice";

const TaskCalendar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tasks } = useSelector((state) => state.tasks);
  const [mode, setMode] = useState("month");

  useEffect(() => {
    dispatch(fetchTasks({ view: mode === "week" ? "week" : "month" }));
  }, [dispatch, mode]);

  const handleSelect = (task) => {
    dispatch(setActiveTask(task));
    navigate(`/dashboard/tasks/${task._id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600 dark:text-violet-300">Calendar View</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--page-text)]">Deadlines and study agenda</h1>
        </div>
        <select className="input-field sm:!w-auto" value={mode} onChange={(event) => setMode(event.target.value)}>
          <option value="month">Monthly Calendar</option>
          <option value="week">Weekly Calendar</option>
          <option value="agenda">Agenda View</option>
        </select>
      </div>

      <DashboardCard subtitle="Task deadlines" title={mode === "agenda" ? "Upcoming deadlines" : "Calendar"}>
        <Calendar tasks={tasks} mode={mode} onSelectTask={handleSelect} />
      </DashboardCard>
    </div>
  );
};

export default TaskCalendar;
