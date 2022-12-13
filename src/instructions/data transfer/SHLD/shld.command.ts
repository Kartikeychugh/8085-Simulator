import { InstructionType } from "../../supported-instructions";
import {
  HexToDec,
  representWithRadix,
} from "../../../utils/hexadecimal-representation";
import { readNumber } from "../../../utils/reading-numbers";
import { mergeBytes } from "../../../utils/read-memory";
import { setMemoryLocation } from "../../../features/memory/memorySlice";

export const SHLD = (): { [key: string]: InstructionType } => {
  const MakeSHLDInstruction = (opcode: string): InstructionType => {
    const INSTRUCTION_SIZE = 3;
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (!line.startsWith("SHLD")) {
          return { compiled: false, compiledCode: null };
        }

        line = line.substring(4).trim();
        const result = readNumber(line);
        if (!result.valid) {
          return { compiled: false, compiledCode: null };
        }

        if (HexToDec(result.value!) > HexToDec("FFFF")) {
          return { compiled: false, compiledCode: null };
        }

        const value = representWithRadix(result.value!, 4);

        const lowBits = value.substring(2);
        const highBits = value.substring(0, 2);

        return { compiled: true, compiledCode: [opcode, lowBits, highBits] };
      },
      execute: (state, dispatch) => {
        const location = state.registers.PC;
        const highValueBits = state.registers.H;
        const lowValueBits = state.registers.L;

        const memoryLocation = mergeBytes(
          state.memory[location + 2],
          state.memory[location + 1]
        );
        const nextMemoryLocation = memoryLocation + 1;

        dispatch(
          setMemoryLocation({
            location: memoryLocation,
            value: lowValueBits,
          })
        );

        dispatch(
          setMemoryLocation({
            location: nextMemoryLocation,
            value: highValueBits,
          })
        );

        return location + INSTRUCTION_SIZE;
      },
    };
  };

  return {
    "22": MakeSHLDInstruction("22"),
  };
};
