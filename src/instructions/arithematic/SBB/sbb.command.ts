import { setFlags } from "../../../features/flags/flagSlice";
import {
  loadRegister,
  Registers,
  selectHLMemoryAddress,
} from "../../../features/registers/registerSlice";
import { InstructionType } from "../../supported-instructions";
import { subtraction } from "../../../utils/subtraction";

export const SBB = (): { [key: string]: InstructionType } => {
  const MakeSBBInstruction = (
    opcode: string,
    source: Registers | "M"
  ): InstructionType => {
    const INSTRUCTION_SIZE = 1;
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (!line.startsWith("SBB")) {
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

        const { result: intermediateResult } = subtraction(
          accumulatorValue,
          operand
        );
        const carry = state.flags.C ? 1 : 0;
        const { result, flags } = subtraction(intermediateResult, carry);

        dispatch(loadRegister({ register: "A", value: result }));
        dispatch(setFlags(flags));

        return location + INSTRUCTION_SIZE;
      },
    };
  };

  return {
    "9F": MakeSBBInstruction("9F", "A"),
    "98": MakeSBBInstruction("98", "B"),
    "99": MakeSBBInstruction("99", "C"),
    "9A": MakeSBBInstruction("9A", "D"),
    "9B": MakeSBBInstruction("9B", "E"),
    "9C": MakeSBBInstruction("9C", "H"),
    "9D": MakeSBBInstruction("9D", "L"),
    "9E": MakeSBBInstruction("9E", "M"),
  };
};
