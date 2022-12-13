import { loadRegister } from "../../../features/registers/registerSlice";
import { InstructionType } from "../../supported-instructions";

export const XCHG = (): { [key: string]: InstructionType } => {
  const MakeXCHGInstruction = (opcode: string): InstructionType => {
    const INSTRUCTION_SIZE = 1;
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (!line.startsWith("XCHG")) {
          return { compiled: false, compiledCode: null };
        }

        line = line.substring(4);
        if (line !== "") {
          return { compiled: false, compiledCode: null };
        }

        return { compiled: true, compiledCode: [opcode] };
      },
      execute: (state, dispatch) => {
        const location = state.registers.PC;

        const eValue = state.registers.E;
        const dValue = state.registers.D;
        const lValue = state.registers.L;
        const hValue = state.registers.H;

        dispatch(loadRegister({ register: "L", value: eValue }));
        dispatch(loadRegister({ register: "H", value: dValue }));
        dispatch(loadRegister({ register: "E", value: lValue }));
        dispatch(loadRegister({ register: "D", value: hValue }));

        return location + INSTRUCTION_SIZE;
      },
    };
  };

  return {
    C6: MakeXCHGInstruction("C6"),
  };
};
