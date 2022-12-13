import { setFlag } from "../../../features/flags/flagSlice";
import { InstructionType } from "../../supported-instructions";

export const STC = (): { [key: string]: InstructionType } => {
  const MakeSTCInstruction = (opcode: string): InstructionType => {
    const INSTRUCTION_SIZE = 1;
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (line !== "STC") {
          return { compiled: false, compiledCode: null };
        }

        return { compiled: true, compiledCode: [opcode] };
      },
      execute: (state, dispatch) => {
        dispatch(setFlag({ flag: "C", value: true }));
        return state.registers.PC + INSTRUCTION_SIZE;
      },
    };
  };

  return {
    "37": MakeSTCInstruction("37"),
  };
};
