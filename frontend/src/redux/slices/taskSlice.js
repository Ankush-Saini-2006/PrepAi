import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  completeTask as completeTaskApi,
  createTask as createTaskApi,
  deleteStudyPlan as deleteStudyPlanApi,
  deleteTask as deleteTaskApi,
  generateStudyPlan as generateStudyPlanApi,
  getStudyPlanById,
  getStudyPlans,
  getTaskById,
  getTaskProgress,
  getTaskStats,
  getTasks,
  updateTask as updateTaskApi,
} from "../../services/taskApi";

export const fetchTasks = createAsyncThunk("tasks/fetchAll", async (params, { rejectWithValue }) => {
  try {
    return await getTasks(params);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch tasks");
  }
});

export const fetchTaskById = createAsyncThunk("tasks/fetchById", async (id, { rejectWithValue }) => {
  try {
    return await getTaskById(id);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch task");
  }
});

export const createTask = createAsyncThunk("tasks/create", async (payload, { rejectWithValue }) => {
  try {
    return await createTaskApi(payload);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create task");
  }
});

export const updateTask = createAsyncThunk("tasks/update", async (payload, { rejectWithValue }) => {
  try {
    return await updateTaskApi(payload);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update task");
  }
});

export const completeTask = createAsyncThunk("tasks/complete", async (payload, { rejectWithValue }) => {
  try {
    return await completeTaskApi(payload);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update completion");
  }
});

export const deleteTask = createAsyncThunk("tasks/delete", async (id, { rejectWithValue }) => {
  try {
    return await deleteTaskApi(id);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete task");
  }
});

export const fetchTaskStats = createAsyncThunk("tasks/fetchStats", async (_, { rejectWithValue }) => {
  try {
    return await getTaskStats();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch task stats");
  }
});

export const fetchTaskProgress = createAsyncThunk("tasks/fetchProgress", async (_, { rejectWithValue }) => {
  try {
    return await getTaskProgress();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch progress");
  }
});

export const generateAIStudyPlan = createAsyncThunk("tasks/generateStudyPlan", async (payload, { rejectWithValue }) => {
  try {
    return await generateStudyPlanApi(payload);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to generate study plan");
  }
});

export const fetchStudyPlans = createAsyncThunk("tasks/fetchStudyPlans", async (_, { rejectWithValue }) => {
  try {
    return await getStudyPlans();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch study plans");
  }
});

export const fetchStudyPlanById = createAsyncThunk("tasks/fetchStudyPlanById", async (id, { rejectWithValue }) => {
  try {
    return await getStudyPlanById(id);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch study plan");
  }
});

export const deleteStudyPlan = createAsyncThunk("tasks/deleteStudyPlan", async (id, { rejectWithValue }) => {
  try {
    return await deleteStudyPlanApi(id);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete study plan");
  }
});

const upsertTask = (tasks, task) => [task, ...tasks.filter((item) => item._id !== task._id)];

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    activeTask: null,
    studyPlans: [],
    activeStudyPlan: null,
    stats: null,
    progress: null,
    loading: false,
    generating: false,
    error: null,
  },
  reducers: {
    setActiveTask: (state, action) => {
      state.activeTask = action.payload;
    },
    clearActiveTask: (state) => {
      state.activeTask = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.activeTask = action.payload;
        state.tasks = upsertTask(state.tasks, action.payload);
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks = upsertTask(state.tasks, action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.tasks = upsertTask(state.tasks, action.payload);
        state.activeTask = action.payload;
      })
      .addCase(completeTask.fulfilled, (state, action) => {
        state.tasks = upsertTask(state.tasks, action.payload);
        if (state.activeTask?._id === action.payload._id) state.activeTask = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
        if (state.activeTask?._id === action.payload) state.activeTask = null;
      })
      .addCase(fetchTaskStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchTaskProgress.fulfilled, (state, action) => {
        state.progress = action.payload;
      })
      .addCase(generateAIStudyPlan.pending, (state) => {
        state.generating = true;
        state.error = null;
      })
      .addCase(generateAIStudyPlan.fulfilled, (state, action) => {
        state.generating = false;
        const planWithTasks = { ...action.payload.plan, tasks: action.payload.tasks };
        state.activeStudyPlan = planWithTasks;
        state.studyPlans = [planWithTasks, ...state.studyPlans.filter((plan) => plan._id !== action.payload.plan._id)];
        state.tasks = [...action.payload.tasks, ...state.tasks];
      })
      .addCase(generateAIStudyPlan.rejected, (state, action) => {
        state.generating = false;
        state.error = action.payload;
      })
      .addCase(fetchStudyPlans.fulfilled, (state, action) => {
        state.studyPlans = action.payload;
        if (!state.activeStudyPlan && action.payload.length > 0) state.activeStudyPlan = action.payload[0];
      })
      .addCase(fetchStudyPlanById.fulfilled, (state, action) => {
        state.activeStudyPlan = action.payload;
        state.studyPlans = [action.payload, ...state.studyPlans.filter((plan) => plan._id !== action.payload._id)];
      })
      .addCase(deleteStudyPlan.fulfilled, (state, action) => {
        state.studyPlans = state.studyPlans.filter((plan) => plan._id !== action.payload);
        if (state.activeStudyPlan?._id === action.payload) state.activeStudyPlan = state.studyPlans[0] || null;
      });
  },
});

export const { clearActiveTask, setActiveTask } = taskSlice.actions;

export default taskSlice.reducer;
