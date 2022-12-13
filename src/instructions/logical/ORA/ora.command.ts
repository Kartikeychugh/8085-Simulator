import { setFlags } from "../../../features/flags/flagSlice";
import {
  loadRegister,
  Registers,
  selectHLMemoryAddress,
} from "../../../features/registers/registerSlice";
import { InstructionType } from "../../supported-instructions";
import { performOR } from "../../../utils/or";

export const ORA = (): { [key: string]: InstructionType } => {
  const MakeORAInstruction = (
    opcode: string,
    source: Registers | "M"
  ): InstructionType => {
    const INSTRUCTION_SIZE = 1;
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (!line.startsWith("ORA")) {
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
        const { result, flags } = performOR(accumulatorValue, operand);

        dispatch(loadRegister({ register: "A", value: result }));
        dispatch(setFlags(flags));

        return location + INSTRUCTION_SIZE;
      },
    };
  };

  return {
    B7: MakeORAInstruction("B7", "A"),
    B0: MakeORAInstruction("B0", "B"),
    B1: MakeORAInstruction("B1", "C"),
    B2: MakeORAInstruction("B2", "D"),
    B3: MakeORAInstruction("B3", "E"),
    B4: MakeORAInstruction("B4", "H"),
    B5: MakeORAInstruction("B5", "L"),
    B6: MakeORAInstruction("B6", "M"),
  };
};
