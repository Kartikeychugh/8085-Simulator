import { loadRegister } from "../../../features/registers/registerSlice";
import { InstructionType } from "../../supported-instructions";
import {
  HexToDec,
  representWithRadix,
} from "../../../utils/hexadecimal-representation";
import { readNumber } from "../../../utils/reading-numbers";
import { mergeBytes } from "../../../utils/read-memory";

export const LDA = (): { [key: string]: InstructionType } => {
  const MakeLDAInstruction = (opcode: string): InstructionType => {
    const INSTRUCTION_SIZE = 3;
    return {
      opcode,
      compiler: (line: string) => {
        if (!line.startsWith("LDA")) {
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
        const value = state.memory[memoryLocation];
        dispatch(loadRegister({ register: "A", value }));

        return location + INSTRUCTION_SIZE;
      },
    };
  };

  return {
    "3A": MakeLDAInstruction("3A"),
  };
};
