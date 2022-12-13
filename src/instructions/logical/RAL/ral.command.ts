import { setFlag } from "../../../features/flags/flagSlice";
import { loadRegister } from "../../../features/registers/registerSlice";
import { InstructionType } from "../../supported-instructions";
import { rotateLeftWithCarry } from "../../../utils/rotate";

export const RAL = (): { [key: string]: InstructionType } => {
  const MakeRALInstruction = (opcode: string): InstructionType => {
    const INSTRUCTION_SIZE = 1;
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (line !== "RAL") {
          return { compiled: false, compiledCode: null };
        }

        return { compiled: true, compiledCode: [opcode] };
      },
      execute: (state, dispatch) => {
        const accumulatorValue = state.registers.A;
        const carry = state.flags.C ? 1 : 0;
        const { result, flags } = rotateLeftWithCarry(
          accumulatorValue,
          carry,
          8
        );
        dispatch(loadRegister({ register: "A", value: result }));
        dispatch(setFlag({ flag: "C", value: flags.C }));

        return state.registers.PC + INSTRUCTION_SIZE;
      },
    };
  };

  return {
    "17": MakeRALInstruction("17"),
  };
};
