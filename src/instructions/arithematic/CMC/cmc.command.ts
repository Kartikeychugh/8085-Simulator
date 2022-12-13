import { setFlag } from "../../../features/flags/flagSlice";
import { InstructionType } from "../../supported-instructions";

export const CMC = (): { [key: string]: InstructionType } => {
  const MakeCMCInstruction = (opcode: string): InstructionType => {
    const INSTRUCTION_SIZE = 1;
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (line !== "CMC") {
          return { compiled: false, compiledCode: null };
        }

        return { compiled: true, compiledCode: [opcode] };
      },
      execute: (state, dispatch) => {
        dispatch(setFlag({ flag: "C", value: !state.flags.C }));
        return state.registers.PC + INSTRUCTION_SIZE;
      },
    };
  };

  return {
    "3F": MakeCMCInstruction("3F"),
  };
};
