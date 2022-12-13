import {
  loadRegister,
  Registers,
} from "../../../features/registers/registerSlice";
import { InstructionType } from "../../supported-instructions";
import { mergeBytes } from "../../../utils/read-memory";

export const LDAX = (): { [key: string]: InstructionType } => {
  const MakeLDAXInstruction = (
    opcode: string,
    high: Registers,
    low: Registers
  ): InstructionType => {
    const INSTRUCTION_SIZE = 1;
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (!line.startsWith("LDAX")) {
          return { compiled: false, compiledCode: null };
        }

        line = line.substring(4).trim();
        if (line !== high) {
          return { compiled: false, compiledCode: null };
        }

        return { compiled: true, compiledCode: [opcode] };
      },
      execute: (state, dispatch) => {
        const higherBits = state.registers[high];
        const lowerBits = state.registers[low];

        const memoryLocation = mergeBytes(higherBits, lowerBits);
        const memoryValue = state.memory[memoryLocation];
        dispatch(loadRegister({ register: "A", value: memoryValue }));

        return state.registers.PC + INSTRUCTION_SIZE;
      },
    };
  };

  return {
    "0A": MakeLDAXInstruction("0A", "B", "C"),
    "1A": MakeLDAXInstruction("1A", "D", "E"),
  };
};
