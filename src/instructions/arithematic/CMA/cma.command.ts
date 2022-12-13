import { loadRegister } from "../../../features/registers/registerSlice";
import { InstructionType } from "../../supported-instructions";
import { complement } from "../../../utils/complement";

export const CMA = (): { [key: string]: InstructionType } => {
  const MakeCMAInstruction = (opcode: string): InstructionType => {
    const INSTRUCTION_SIZE = 1;
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (line !== "CMA") {
          return { compiled: false, compiledCode: null };
        }

        return { compiled: true, compiledCode: [opcode] };
      },
      execute: (state, dispatch) => {
        const accumulatorValue = state.registers.A;
        const complementedValue = complement(accumulatorValue, 8);
        dispatch(loadRegister({ register: "A", value: complementedValue }));
        return state.registers.PC + INSTRUCTION_SIZE;
      },
    };
  };

  return {
    "2F": MakeCMAInstruction("2F"),
  };
};
