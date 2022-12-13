import { setFlags } from "../../../features/flags/flagSlice";
import {
  loadRegister,
  Registers,
  selectHLMemoryAddress,
} from "../../../features/registers/registerSlice";
import { InstructionType } from "../../supported-instructions";
import { performXOR } from "../../../utils/xor";

export const XRA = (): { [key: string]: InstructionType } => {
  const MakeXRAInstruction = (
    opcode: string,
    source: Registers | "M"
  ): InstructionType => {
    const INSTRUCTION_SIZE = 1;
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (!line.startsWith("XRA")) {
          return { compiled: false, compiledCode: null };
        }

        const r = line.substring(3).trim();
        if (r !== source) {
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
        const { result, flags } = performXOR(accumulatorValue, operand);

        dispatch(loadRegister({ register: "A", value: result }));
        dispatch(setFlags(flags));

        return location + INSTRUCTION_SIZE;
      },
    };
  };

  return {
    AF: MakeXRAInstruction("AF", "A"),
    A8: MakeXRAInstruction("A8", "B"),
    A9: MakeXRAInstruction("A9", "C"),
    AA: MakeXRAInstruction("AA", "D"),
    AB: MakeXRAInstruction("AB", "E"),
    AC: MakeXRAInstruction("AC", "H"),
    AD: MakeXRAInstruction("AD", "L"),
    AE: MakeXRAInstruction("AE", "M"),
  };
};
