import {
  loadRegisterPair,
  Registers,
} from "../../../features/registers/registerSlice";
import { InstructionType } from "../../supported-instructions";
import {
  HexToDec,
  representWithRadix,
} from "../../../utils/hexadecimal-representation";
import { readNumber } from "../../../utils/reading-numbers";

export const LXI = (): { [key: string]: InstructionType } => {
  const MakeLXIInstruction = (
    opcode: string,
    register: Registers
  ): InstructionType => {
    const INSTRUCTION_SIZE = 3;
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (!line.startsWith("LXI")) {
          return { compiled: false, compiledCode: null };
        }

        line = line.substring(3).trim();
        if (register !== line[0]) {
          return { compiled: false, compiledCode: null };
        }

        line = line.substring(line.indexOf(",") + 1).trim();
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

        dispatch(
          loadRegisterPair({ register, highValue: highbits, lowValue: lowBits })
        );

        return location + INSTRUCTION_SIZE;
      },
    };
  };

  return {
    "01": MakeLXIInstruction("01", "B"),
    "11": MakeLXIInstruction("11", "D"),
    "21": MakeLXIInstruction("21", "H"),
  };
};
