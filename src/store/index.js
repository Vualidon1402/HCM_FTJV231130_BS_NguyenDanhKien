import { configureStore } from "@reduxjs/toolkit";
import { taskReducer } from "./slices/task.slice";

const Store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
});

export default Store;
