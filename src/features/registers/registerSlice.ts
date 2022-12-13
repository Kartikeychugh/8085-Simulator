import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { HexToDec } from "../../utils/hexadecimal-representation";
import { mergeBytes } from "../../utils/read-memory";

export type Registers = "A" | "B" | "C" | "D" | "E" | "H" | "L" | "PC" | "SP";
export enum SupportedRegisters {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
  H = "H",
  L = "L",
  PC = "PC",
}

export type RegistersState = { [key in Registers]: number };
const initialState: RegistersState = {
  A: 0,
  B: 0,
  C: 0,
  D: 0,
  E: 0,
  H: 0,
  L: 0,
  PC: 0,
  SP: 8192,
};

export const registersSlice = createSlice({
  name: "registers",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    loadRegister: (
      state,
      action: PayloadAction<{ register: Registers; value: number }>
    ) => {
      const { register, value } = action.payload;

      if (isNaN(value) || value === null || value === undefined) return;
      if (state[register] === value) return;
      if (register === "PC") {
        if (value > 8191) return;
      } else if (register === "SP") {
        if (value > 8192) return;
      } else {
        if (value > HexToDec("FF")) return;
      }

      state[register] = value;
    },
    loadRegisterPair: (
      state,
      action: PayloadAction<{
        register: Registers;
        highValue: number;
        lowValue: number;
      }>
    ) => {
      const { register, highValue, lowValue } = action.payload;
      if (isNaN(highValue) || highValue === null || highValue === undefined)
        return;
      if (isNaN(lowValue) || lowValue === null || lowValue === undefined)
        return;

      if (highValue > HexToDec("FF")) return;
      if (lowValue > HexToDec("FF")) return;

      if (register === "B") {
        state.B = highValue;
        state.C = highValue;
      } else if (register === "D") {
        state.D = highValue;
        state.E = highValue;
      } else if (register === "H") {
        state.H = highValue;
        state.L = highValue;
      }
    },
    resetRegisters: (state) => {
      Object.entries(initialState).forEach((keyValue) => {
        state[keyValue[0] as Registers] = keyValue[1];
      });
    },
  },
});

export const { loadRegister, loadRegisterPair, resetRegisters } =
  registersSlice.actions;
export const selectRegisters = (state: RootState) => state.registers;
export const selectHLMemoryAddress = (state: RootState) => {
  const H = state.registers.H;
  const L = state.registers.L;
  return mergeBytes(H, L);
};
export default registersSlice.reducer;
