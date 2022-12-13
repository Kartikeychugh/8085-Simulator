import {
  loadRegister,
  Registers,
  selectHLMemoryAddress,
} from "../../../features/registers/registerSlice";
import { InstructionType } from "../../supported-instructions";
import { HexToDec } from "../../../utils/hexadecimal-representation";
import { readNumber } from "../../../utils/reading-numbers";
import { setMemoryLocation } from "../../../features/memory/memorySlice";

export const MVI = (): { [key: string]: InstructionType } => {
  const MakeMVIInstruction = (
    opcode: string,
    destination: Registers | "M"
  ): InstructionType => {
    const INSTRUCTION_SIZE = 2;
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (!line.startsWith("MVI")) {
          return { compiled: false, compiledCode: null };
        }

        line = line.substring(3).trim();
        if (line[0] !== destination) {
          return { compiled: false, compiledCode: null };
        }

        const commaIndex = line.indexOf(",");
        line = line.substring(commaIndex + 1).trim();
        const result = readNumber(line);
        if (!result.valid) {
          return { compiled: false, compiledCode: null };
        }

        if (HexToDec(result.value!) > HexToDec("FF")) {
          return { compiled: false, compiledCode: null };
        }

        return { compiled: true, compiledCode: [opcode, result.value!] };
      },
      execute: (state, dispatch) => {
        const location = state.registers.PC;
        const value = state.memory[location + 1];

        if (destination === "M") {
          const memoryAddress = selectHLMemoryAddress(state);
          dispatch(setMemoryLocation({ location: memoryAddress, value }));
        } else {
          dispatch(loadRegister({ register: destination, value }));
        }

        return location + INSTRUCTION_SIZE;
      },
    };
  };

  return {
    "3E": MakeMVIInstruction("3E", "A"),
    "06": MakeMVIInstruction("06", "B"),
    "0E": MakeMVIInstruction("0E", "C"),
    "16": MakeMVIInstruction("16", "D"),
    "1E": MakeMVIInstruction("1E", "E"),
    "26": MakeMVIInstruction("26", "H"),
    "2E": MakeMVIInstruction("2E", "L"),
    "36": MakeMVIInstruction("36", "M"),
  };
};
