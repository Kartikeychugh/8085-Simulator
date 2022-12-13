import { setFlags } from "../../../features/flags/flagSlice";
import {
  loadRegister,
  Registers,
  selectHLMemoryAddress,
} from "../../../features/registers/registerSlice";
import { InstructionType } from "../../supported-instructions";
import { performAND } from "../../../utils/and";

export const ANA = (): { [key: string]: InstructionType } => {
  const MakeANAInstruction = (
    opcode: string,
    source: Registers | "M"
  ): InstructionType => {
    const INSTRUCTION_SIZE = 1;
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (!line.startsWith("ANA")) {
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
        const { result, flags } = performAND(accumulatorValue, operand);

        dispatch(loadRegister({ register: "A", value: result }));
        dispatch(setFlags(flags));

        return location + INSTRUCTION_SIZE;
      },
    };
  };

  return {
    A7: MakeANAInstruction("A7", "A"),
    A0: MakeANAInstruction("A0", "B"),
    A1: MakeANAInstruction("A1", "C"),
    A2: MakeANAInstruction("A2", "D"),
    A3: MakeANAInstruction("A3", "E"),
    A4: MakeANAInstruction("A4", "H"),
    A5: MakeANAInstruction("A5", "L"),
  };
};
