import { setFlag } from "../../../features/flags/flagSlice";
import { loadRegister } from "../../../features/registers/registerSlice";
import { InstructionType } from "../../supported-instructions";
import { rotateRightWithCarry } from "../../../utils/rotate";

export const RAR = (): { [key: string]: InstructionType } => {
  const MakeRARInstruction = (opcode: string): InstructionType => {
    const INSTRUCTION_SIZE = 1;
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (line !== "RAR") {
          return { compiled: false, compiledCode: null };
        }

        return { compiled: true, compiledCode: [opcode] };
      },
      execute: (state, dispatch) => {
        const accumulatorValue = state.registers.A;
        const carry = state.flags.C ? 1 : 0;
        const { result, flags } = rotateRightWithCarry(
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
    "1F": MakeRARInstruction("1F"),
  };
};
