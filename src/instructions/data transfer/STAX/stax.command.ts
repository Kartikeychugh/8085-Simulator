import { Registers } from "../../../features/registers/registerSlice";
import { InstructionType } from "../../supported-instructions";
import { mergeBytes } from "../../../utils/read-memory";
import { setMemoryLocation } from "../../../features/memory/memorySlice";

export const STAX = (): { [key: string]: InstructionType } => {
  const MakeSTAXInstruction = (
    opcode: string,
    high: Registers,
    low: Registers
  ): InstructionType => {
    const INSTRUCTION_SIZE = 1;
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (!line.startsWith("STAX")) {
          return { compiled: false, compiledCode: null };
        }

        line = line.substring(4).trim();
        if (line !== high) {
          return { compiled: false, compiledCode: null };
        }

        return { compiled: true, compiledCode: [opcode] };
      },
      execute: (state, dispatch) => {
        const location = state.registers.PC;
        const highBits = state.registers[high];
        const lowBits = state.registers[low];

        const memoryLocation = mergeBytes(highBits, lowBits);
        const accumulatorValue = state.registers.A;
        dispatch(
          setMemoryLocation({
            location: memoryLocation,
            value: accumulatorValue,
          })
        );

        return location + INSTRUCTION_SIZE;
      },
    };
  };

  return {
    "02": MakeSTAXInstruction("02", "B", "C"),
    "12": MakeSTAXInstruction("02", "D", "E"),
  };
};
