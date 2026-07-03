import EmptyState from "../common/EmptyState";
import TaskCard from "./TaskCard";

const TaskList = ({ tasks, onSelect, onComplete, onDelete }) => {
  if (!tasks.length) {
    return <EmptyState title="No tasks found" description="Create a task or generate an AI study plan to populate this view." />;
  }

  return (
    <div className="grid gap-3">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} onSelect={onSelect} onComplete={onComplete} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default TaskList;
