import { setFlag } from "../../../features/flags/flagSlice";
import {
  loadRegister,
  Registers,
} from "../../../features/registers/registerSlice";
import { InstructionType } from "../../supported-instructions";
import { mergeBytes, splitIntoBytes } from "../../../utils/read-memory";

export const DAD = (): { [key: string]: InstructionType } => {
  const MakeDADInstruction = (
    opcode: string,
    high: Registers,
    low: Registers
  ): InstructionType => {
    const INSTRUCTION_SIZE = 1;
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (!line.startsWith("DAD")) {
          return { compiled: false, compiledCode: null };
        }

        line = line.substring(3).trim();
        if (line !== high) {
          return { compiled: false, compiledCode: null };
        }

        return { compiled: true, compiledCode: [opcode] };
      },
      execute: (state, dispatch) => {
        const hValue = state.registers.H;
        const lValue = state.registers.L;
        const highValue = state.registers[high];
        const lowValue = state.registers[low];

        const a = mergeBytes(hValue, lValue);
        const b = mergeBytes(highValue, lowValue);

        let value = a + b;
        if (value >= Math.pow(2, 16)) {
          value -= Math.pow(2, 16);
          dispatch(setFlag({ flag: "C", value: true }));
        }

        const [h, l] = splitIntoBytes(value);

        dispatch(loadRegister({ register: "H", value: h }));
        dispatch(loadRegister({ register: "L", value: l }));

        return state.registers.PC + INSTRUCTION_SIZE;
      },
    };
  };

  return {
    "09": MakeDADInstruction("09", "B", "C"),
    "19": MakeDADInstruction("19", "D", "E"),
    "29": MakeDADInstruction("29", "H", "L"),
  };
};
