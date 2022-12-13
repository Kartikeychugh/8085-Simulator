import { setFlags } from "../../../features/flags/flagSlice";
import {
  loadRegister,
  Registers,
  selectHLMemoryAddress,
} from "../../../features/registers/registerSlice";
import { InstructionType } from "../../supported-instructions";
import { subtraction } from "../../../utils/subtraction";

export const SUB = (): { [key: string]: InstructionType } => {
  const MakeSUBInstruction = (
    opcode: string,
    source: Registers | "M"
  ): InstructionType => {
    const INSTRUCTION_SIZE = 1;
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (!line.startsWith("SUB")) {
          return { compiled: false, compiledCode: null };
        }

        line = line.substring(3).trim();
        if (line !== source) {
          return { compiled: false, compiledCode: null };
        }

        return { compiled: true, compiledCode: [opcode] };
      },
      execute: (state, dispatch) => {
        const location = state.registers.PC;
        const operand =
          source === "M"
            ? state.memory[selectHLMemoryAddress(state)]
            : state.registers[source];
        const accumulatorValue = state.registers.A;

        const { result, flags } = subtraction(accumulatorValue, operand);

        dispatch(loadRegister({ register: "A", value: result }));
        dispatch(setFlags(flags));

        return location + INSTRUCTION_SIZE;
      },
    };
  };

  return {
    "97": MakeSUBInstruction("97", "A"),
    "90": MakeSUBInstruction("90", "B"),
    "91": MakeSUBInstruction("91", "C"),
    "92": MakeSUBInstruction("92", "D"),
    "93": MakeSUBInstruction("93", "E"),
    "94": MakeSUBInstruction("94", "H"),
    "95": MakeSUBInstruction("95", "L"),
    "96": MakeSUBInstruction("96", "M"),
  };
};
