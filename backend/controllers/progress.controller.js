const asyncHandler = require("express-async-handler");
const Task = require("../models/Task");
const TaskProgress = require("../models/TaskProgress");
const ApiResponse = require("../utils/ApiResponse");

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

const getRange = (days) => {
  const end = endOfDay();
  const start = startOfDay();
  start.setDate(start.getDate() - (days - 1));
  return { start, end };
};

const calculateStreak = (completedTasks) => {
  const completedDays = new Set(
    completedTasks
      .map((task) => startOfDay(task.completedAt || task.updatedAt).toISOString().slice(0, 10))
      .filter(Boolean)
  );

  const cursor = startOfDay();
  let streak = 0;
  while (completedDays.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

const buildDailySeries = (tasks, days = 7) => {
  return Array.from({ length: days }, (_, index) => {
    const date = startOfDay();
    date.setDate(date.getDate() - (days - 1 - index));
    const key = date.toISOString().slice(0, 10);
    const dayTasks = tasks.filter((task) => startOfDay(task.dueDate).toISOString().slice(0, 10) === key);
    const completed = dayTasks.filter((task) => task.status === "Completed").length;
    return {
      day: new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(date),
      tasks: dayTasks.length,
      completed,
      hours: Number((dayTasks.reduce((sum, task) => sum + (task.actualStudyMinutes || 0), 0) / 60).toFixed(1)),
      completion: dayTasks.length ? Math.round((completed / dayTasks.length) * 100) : 0,
    };
  });
};

const getProgressOverview = asyncHandler(async (req, res) => {
  const allTasks = await Task.find({ user: req.user._id }).sort("dueDate");
  const completedTasks = allTasks.filter((task) => task.status === "Completed");
  const missedTasks = allTasks.filter((task) => task.status === "Missed");
  const totalTasks = allTasks.length;
  const completionPercentage = totalTasks ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
  const hoursStudied = Number((completedTasks.reduce((sum, task) => sum + (task.actualStudyMinutes || task.estimatedStudyMinutes || 0), 0) / 60).toFixed(1));

  const { start: weekStart, end: weekEnd } = getRange(7);
  const { start: monthStart, end: monthEnd } = getRange(30);
  const weeklyTasks = allTasks.filter((task) => task.dueDate >= weekStart && task.dueDate <= weekEnd);
  const monthlyTasks = allTasks.filter((task) => task.dueDate >= monthStart && task.dueDate <= monthEnd);

  const categoryDistribution = Object.entries(
    allTasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const dailyProgress = buildDailySeries(allTasks, 7);
  const weeklyCompletion = weeklyTasks.length
    ? Math.round((weeklyTasks.filter((task) => task.status === "Completed").length / weeklyTasks.length) * 100)
    : 0;
  const monthlyCompletion = monthlyTasks.length
    ? Math.round((monthlyTasks.filter((task) => task.status === "Completed").length / monthlyTasks.length) * 100)
    : 0;

  const today = startOfDay();
  await TaskProgress.findOneAndUpdate(
    { user: req.user._id, date: today },
    {
      user: req.user._id,
      date: today,
      tasksCompleted: completedTasks.filter((task) => task.completedAt && task.completedAt >= today).length,
      tasksMissed: missedTasks.length,
      hoursStudied,
      completionPercentage,
      averageCompletionMinutes: completedTasks.length
        ? Math.round(completedTasks.reduce((sum, task) => sum + (task.actualStudyMinutes || task.estimatedStudyMinutes || 0), 0) / completedTasks.length)
        : 0,
    },
    { upsert: true, new: true }
  );

  res.status(200).json(
    new ApiResponse(200, {
      summary: {
        totalTasks,
        pendingTasks: allTasks.filter((task) => task.status === "Pending").length,
        inProgressTasks: allTasks.filter((task) => task.status === "In Progress").length,
        completedTasks: completedTasks.length,
        missedTasks: missedTasks.length,
        completionPercentage,
        dailyStreak: calculateStreak(completedTasks),
        weeklyProgress: weeklyCompletion,
        monthlyProgress: monthlyCompletion,
        hoursStudied,
        averageCompletionTime: completedTasks.length
          ? Math.round(completedTasks.reduce((sum, task) => sum + (task.actualStudyMinutes || task.estimatedStudyMinutes || 0), 0) / completedTasks.length)
          : 0,
      },
      charts: {
        dailyProgress,
        weeklyProgress: dailyProgress,
        monthlyProgress: buildDailySeries(allTasks, 30),
        categoryDistribution,
        studyHours: dailyProgress.map((item) => ({ day: item.day, hours: item.hours })),
      },
    })
  );
});

module.exports = { getProgressOverview };
