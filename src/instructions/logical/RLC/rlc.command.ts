import { setFlag } from "../../../features/flags/flagSlice";
import { loadRegister } from "../../../features/registers/registerSlice";
import { InstructionType } from "../../supported-instructions";
import { rotateLeft } from "../../../utils/rotate";

export const RLC = (): { [key: string]: InstructionType } => {
  const MakeRLCInstruction = (opcode: string): InstructionType => {
    const INSTRUCTION_SIZE = 1;
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (line !== "RLC") {
          return { compiled: false, compiledCode: null };
        }

        return { compiled: true, compiledCode: [opcode] };
      },
      execute: (state, dispatch) => {
        const accumulatorValue = state.registers.A;
        const { result, flags } = rotateLeft(accumulatorValue, 8);

        dispatch(loadRegister({ register: "A", value: result }));
        dispatch(setFlag({ flag: "C", value: flags.C }));

        return state.registers.PC + INSTRUCTION_SIZE;
      },
    };
  };

  return {
    "07": MakeRLCInstruction("07"),
  };
};
