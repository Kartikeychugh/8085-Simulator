import {
  loadRegister,
  Registers,
} from "../../../features/registers/registerSlice";
import { InstructionType } from "../../supported-instructions";
import { mergeBytes, splitIntoBytes } from "../../../utils/read-memory";

export const INX = (): { [key: string]: InstructionType } => {
  const MakeINXInstruction = (
    opcode: string,
    high: Registers,
    low: Registers
  ): InstructionType => {
    const INSTRUCTION_SIZE = 1;
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (!line.startsWith("INX")) {
          return { compiled: false, compiledCode: null };
        }

        line = line.substring(3).trim();
        if (line !== high) {
          return { compiled: false, compiledCode: null };
        }

        return { compiled: true, compiledCode: [opcode] };
      },
      execute: (state, dispatch) => {
        const highBits = state.registers[high];
        const lowBits = state.registers[low];
        const value = mergeBytes(highBits, lowBits) + 1;
        const [h, l] = splitIntoBytes(value);

        dispatch(loadRegister({ register: high, value: h }));
        dispatch(loadRegister({ register: low, value: l }));

        return state.registers.PC + INSTRUCTION_SIZE;
      },
    };
  };

  return {
    "03": MakeINXInstruction("03", "B", "C"),
    "13": MakeINXInstruction("13", "D", "E"),
    "23": MakeINXInstruction("23", "H", "L"),
  };
};
