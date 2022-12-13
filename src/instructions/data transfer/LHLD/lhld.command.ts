import { loadRegister } from "../../../features/registers/registerSlice";
import { InstructionType } from "../../supported-instructions";
import {
  HexToDec,
  representWithRadix,
} from "../../../utils/hexadecimal-representation";
import { readNumber } from "../../../utils/reading-numbers";
import { mergeBytes } from "../../../utils/read-memory";

export const LHLD = (): { [key: string]: InstructionType } => {
  const MakeLHLDInstruction = (opcode: string): InstructionType => {
    const INSTRUCTION_SIZE = 3;
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (!line.startsWith("LHLD")) {
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
        const lowerBits = state.memory[location + 1];
        const higherBits = state.memory[location + 2];

        const lowerBitsMemoryLocation = mergeBytes(higherBits, lowerBits);
        const higherBitsMemoryLocation = lowerBitsMemoryLocation + 1;

        dispatch(
          loadRegister({
            register: "H",
            value: state.memory[higherBitsMemoryLocation],
          })
        );

        dispatch(
          loadRegister({
            register: "L",
            value: state.memory[lowerBitsMemoryLocation],
          })
        );

        return location + INSTRUCTION_SIZE;
      },
    };
  };

  return {
    "2A": MakeLHLDInstruction("2A"),
  };
};
