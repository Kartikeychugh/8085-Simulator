import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export type MemoryState = Array<number>;

const createInitialState = () => {
  let mem = [];
  for (let i = 0; i < 8192; i++) {
    mem[i] = 0;
  }
  return mem;
};

export const memorySlice = createSlice({
  name: "memory",
  initialState: createInitialState(),
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setMemoryLocation: (
      state,
      action: PayloadAction<{ location: number; value: number }>
    ) => {
      state[action.payload.location] = action.payload.value;
    },
    resetMemory: (state) => {
      for (let i = 0; i < 8192; i++) {
        state[i] = 0;
      }
    },
  },
});

export const { setMemoryLocation, resetMemory } = memorySlice.actions;
export const selectMemory = (state: RootState) => state.memory;
export const selectMemoryLocation = (location: number) => (state: RootState) =>
  state.memory[location];

export default memorySlice.reducer;
