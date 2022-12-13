import { RootState } from "../../../app/store";
import {
  HexToDec,
  representWithRadix,
} from "../../../utils/hexadecimal-representation";
import { mergeBytes } from "../../../utils/read-memory";
import { readNumber } from "../../../utils/reading-numbers";
import { InstructionType } from "../../supported-instructions";

export const JUMP = (): { [key: string]: InstructionType } => {
  const INSTRUCTION_SIZE = 3;
  const MakeJInstruction = (
    opcode: string,
    code: string,
    condition: (state: RootState) => boolean
  ): InstructionType => {
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (!line.startsWith(code)) {
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
      execute: (state, _dispatch, _stack) => {
        const location = state.registers.PC;

        if (condition(state)) {
          const lowBits = state.memory[location + 1];
          const highBits = state.memory[location + 2];
          return mergeBytes(highBits, lowBits);
        } else {
          return location + INSTRUCTION_SIZE;
        }
      },
    };
  };

  return {
    C3: MakeJInstruction("C3", "JMP", () => true),
    C2: MakeJInstruction("C2", "JNZ", (state) => !state.flags.Z),
    CA: MakeJInstruction("CA", "JZ", (state) => state.flags.Z),
    D2: MakeJInstruction("D2", "JNC", (state) => !state.flags.C),
    DA: MakeJInstruction("DA", "JC", (state) => state.flags.C),
    E2: MakeJInstruction("E2", "JPO", (state) => !state.flags.P),
    EA: MakeJInstruction("EA", "JPE", (state) => state.flags.P),
    F2: MakeJInstruction("F2", "JP", (state) => !state.flags.S),
    FA: MakeJInstruction("FA", "JM", (state) => state.flags.S),
  };
};
