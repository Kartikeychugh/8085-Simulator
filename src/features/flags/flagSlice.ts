import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export type Flags = "Z" | "C" | "P" | "S";

export type FlagsState = { [key in Flags]: boolean };

const initialState: FlagsState = {
  Z: false,
  C: false,
  P: false,
  S: false,
};

export const flagsSlice = createSlice({
  name: "flags",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setFlags: (state, action: PayloadAction<FlagsState>) => {
      Object.entries(action.payload).forEach((keyValuePair) => {
        state[keyValuePair[0] as Flags] = keyValuePair[1];
      });
    },
    setFlag: (
      state,
      action: PayloadAction<{ flag: Flags; value: boolean }>
    ) => {
      state[action.payload.flag] = action.payload.value;
    },
    resetFlags: (state) => {
      Object.entries(initialState).forEach((keyValuePair) => {
        state[keyValuePair[0] as Flags] = keyValuePair[1];
      });
    },
  },
});

export const { setFlag, setFlags, resetFlags } = flagsSlice.actions;
export const selectFlags = (state: RootState) => state.flags;

export default flagsSlice.reducer;
