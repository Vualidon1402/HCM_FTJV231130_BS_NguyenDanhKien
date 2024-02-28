import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getTasks = createAsyncThunk("task/getTasks", async () => {
  try {
    const response = await axios.get("http://localhost:3000/tasks");
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("Error", error);
  }
});

const taskSlice = createSlice({
  name: "task",
  initialState: {
    tasks: [],
  },
  reducers: {
    setTask: (state, action) => {
      state.tasks = action.payload;
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    updateTaskStatus: (state, action) => {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) {
        task.status = task.status === "completed" ? "incompleted" : "completed";
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTasks.fulfilled, (state, action) => {
      state.tasks = action.payload;
    });
  },
});

export const taskActions = { ...taskSlice.actions, getTasks };
export const taskReducer = taskSlice.reducer;
