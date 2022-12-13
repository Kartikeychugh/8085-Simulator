import { setFlags } from "../../../features/flags/flagSlice";
import {
  Registers,
  selectHLMemoryAddress,
} from "../../../features/registers/registerSlice";
import { InstructionType } from "../../supported-instructions";
import { subtraction } from "../../../utils/subtraction";

export const CMP = (): { [key: string]: InstructionType } => {
  const MakeCMPInstruction = (
    opcode: string,
    source: Registers | "M"
  ): InstructionType => {
    const INSTRUCTION_SIZE = 1;
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (!line.startsWith("CMP")) {
          return { compiled: false, compiledCode: null };
        }

        line = line.substring(3).trim();
        if (line !== source) {
          return { compiled: false, compiledCode: null };
        }

        return { compiled: true, compiledCode: [opcode] };
      },
      execute: (state, dispatch) => {
        const accumulatorValue = state.registers.A;
        const operand =
          source === "M"
            ? state.memory[selectHLMemoryAddress(state)]
            : state.registers[source];

        const { flags } = subtraction(accumulatorValue, operand);
        dispatch(setFlags(flags));

        return state.registers.PC + INSTRUCTION_SIZE;
      },
    };
  };

  return {
    BF: MakeCMPInstruction("BF", "A"),
    B8: MakeCMPInstruction("B8", "B"),
    B9: MakeCMPInstruction("B9", "C"),
    BA: MakeCMPInstruction("BA", "D"),
    BB: MakeCMPInstruction("BB", "E"),
    BC: MakeCMPInstruction("BC", "H"),
    BD: MakeCMPInstruction("BD", "L"),
    BE: MakeCMPInstruction("BE", "M"),
  };
};
