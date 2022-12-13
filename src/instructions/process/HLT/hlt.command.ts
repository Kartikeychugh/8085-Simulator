import { InstructionType } from "../../supported-instructions";

export const HLT = (): { [key: string]: InstructionType } => {
  const MakeHLTInstruction = (opcode: string): InstructionType => {
    return {
      opcode,
      compiler: (line) => {
        const compiledCode: string[] = [];
        const cleanedLine = line.trim();
        if (cleanedLine.length === 3 && cleanedLine.startsWith("HLT")) {
          compiledCode.push(opcode);
          return { compiled: true, compiledCode };
        } else {
          return { compiled: false, compiledCode: null };
        }
      },
      execute: (state, _dispatch) => {
        return state.registers.PC;
      },
    };
  };

  return {
    76: MakeHLTInstruction("76"),
  };
};
