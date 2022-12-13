import { InstructionType } from "../../supported-instructions";
import {
  HexToDec,
  representWithRadix,
} from "../../../utils/hexadecimal-representation";
import { readNumber } from "../../../utils/reading-numbers";
import { mergeBytes } from "../../../utils/read-memory";
import { setMemoryLocation } from "../../../features/memory/memorySlice";

export const STA = (): { [key: string]: InstructionType } => {
  const MakeSTAInstruction = (opcode: string): InstructionType => {
    const INSTRUCTION_SIZE = 3;
    return {
      opcode,
      compiler: (line: string) => {
        if (!line.startsWith("STA")) {
          return { compiled: false, compiledCode: null };
        }

        line = line.substring(3).trim();
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
        let location = state.registers.PC;
        const lowBits = state.memory[location + 1];
        const highbits = state.memory[location + 2];
        const memoryLocation = mergeBytes(highbits, lowBits);
        const value = state.registers.A;
        dispatch(setMemoryLocation({ location: memoryLocation, value }));

        return location + INSTRUCTION_SIZE;
      },
    };
  };

  return {
    "32": MakeSTAInstruction("32"),
  };
};
