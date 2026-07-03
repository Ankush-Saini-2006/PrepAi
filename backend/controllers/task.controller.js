const asyncHandler = require("express-async-handler");
const Task = require("../models/Task");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { getProgressOverview } = require("./progress.controller");

const startOfDay = (value = new Date()) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const endOfDay = (value = new Date()) => {
  const date = new Date(value);
  date.setHours(23, 59, 59, 999);
  return date;
};

const getFilterForView = (view) => {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  if (view === "today") return { dueDate: { $gte: todayStart, $lte: todayEnd } };
  if (view === "tomorrow") {
    const start = startOfDay(now);
    start.setDate(start.getDate() + 1);
    const end = endOfDay(start);
    return { dueDate: { $gte: start, $lte: end } };
  }
  if (view === "week") {
    const end = endOfDay(now);
    end.setDate(end.getDate() + 6);
    return { dueDate: { $gte: todayStart, $lte: end } };
  }
  if (view === "month") {
    const end = endOfDay(now);
    end.setDate(end.getDate() + 30);
    return { dueDate: { $gte: todayStart, $lte: end } };
  }
  if (view === "overdue") return { dueDate: { $lt: todayStart }, status: { $ne: "Completed" } };
  if (view === "completed") return { status: "Completed" };
  return {};
};

const allowedTaskFields = [
  "studyPlan",
  "title",
  "description",
  "category",
  "priority",
  "status",
  "dueDate",
  "completedAt",
  "estimatedStudyMinutes",
  "actualStudyMinutes",
  "notes",
  "reminderAt",
  "recurring",
  "company",
  "careerGoal",
  "source",
];

const sanitizeTaskPayload = (payload) => {
  return allowedTaskFields.reduce((acc, field) => {
    if (payload[field] === undefined) return acc;
    acc[field] = payload[field] === "" && ["studyPlan", "completedAt", "reminderAt"].includes(field)
      ? null
      : payload[field];
    return acc;
  }, {});
};

const createTask = asyncHandler(async (req, res) => {
  const { title, dueDate } = req.body;
  if (!title?.trim()) throw new ApiError(400, "Task title is required");
  if (!dueDate) throw new ApiError(400, "Task deadline is required");

  const task = await Task.create({
    ...sanitizeTaskPayload(req.body),
    title: title.trim(),
    user: req.user._id,
    source: req.body.source || "Manual",
  });

  res.status(201).json(new ApiResponse(201, { task }, "Task created successfully"));
});

const getTasks = asyncHandler(async (req, res) => {
  const { view, category, status, priority, company } = req.query;
  const filter = { user: req.user._id, ...getFilterForView(view) };
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (company) filter.company = new RegExp(company, "i");

  const tasks = await Task.find(filter).sort({ dueDate: 1, priority: -1, createdAt: -1 });
  res.status(200).json(new ApiResponse(200, { tasks }));
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) throw new ApiError(404, "Task not found");
  res.status(200).json(new ApiResponse(200, { task }));
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) throw new ApiError(404, "Task not found");

  Object.assign(task, sanitizeTaskPayload(req.body));
  if (req.body.status === "Completed" && !task.completedAt) task.completedAt = new Date();
  if (req.body.status && req.body.status !== "Completed") task.completedAt = null;
  await task.save();

  res.status(200).json(new ApiResponse(200, { task }, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) throw new ApiError(404, "Task not found");
  await task.deleteOne();
  res.status(200).json(new ApiResponse(200, null, "Task deleted successfully"));
});

const completeTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) throw new ApiError(404, "Task not found");

  task.status = task.status === "Completed" ? "Pending" : "Completed";
  task.completedAt = task.status === "Completed" ? new Date() : null;
  task.actualStudyMinutes = req.body.actualStudyMinutes ?? task.actualStudyMinutes;
  await task.save();

  res.status(200).json(new ApiResponse(200, { task }, "Task completion updated"));
});

const getTaskStats = asyncHandler(async (req, res) => {
  const todayStart = startOfDay();
  const todayEnd = endOfDay();
  const tasks = await Task.find({ user: req.user._id }).sort("dueDate");
  const todaysTasks = tasks.filter((task) => task.dueDate >= todayStart && task.dueDate <= todayEnd);
  const pendingTasks = tasks.filter((task) => task.status !== "Completed").length;
  const completedTasks = tasks.filter((task) => task.status === "Completed").length;
  const upcomingDeadline = tasks.find((task) => task.status !== "Completed" && task.dueDate >= todayStart) || null;

  res.status(200).json(
    new ApiResponse(200, {
      stats: {
        todaysTasks,
        pendingTasks,
        completedTasks,
        progress: tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0,
        upcomingDeadline,
        studyHours: Number((tasks.reduce((sum, task) => sum + (task.actualStudyMinutes || 0), 0) / 60).toFixed(1)),
        todaysGoal: todaysTasks[0]?.title || "",
      },
    })
  );
});

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  completeTask,
  getTaskStats,
  getProgressOverview,
};
