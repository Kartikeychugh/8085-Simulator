import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import flagSlice from "../features/flags/flagSlice";
import registersSlice from "../features/registers/registerSlice";
import memorySlice from "../features/memory/memorySlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    flags: flagSlice,
    registers: registersSlice,
    memory: memorySlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
