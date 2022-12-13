import { setFlags } from "../../../features/flags/flagSlice";
import {
  loadRegister,
  Registers,
  selectHLMemoryAddress,
} from "../../../features/registers/registerSlice";
import { InstructionType } from "../../supported-instructions";
import { addition } from "../../../utils/addition";

export const ADC = (): { [key: string]: InstructionType } => {
  const MakeADCInstruction = (
    opcode: string,
    source: Registers | "M"
  ): InstructionType => {
    const INSTRUCTION_SIZE = 1;
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (!line.startsWith("ADC")) {
          return { compiled: false, compiledCode: null };
        }

        line = line.substring(3).trim();
        if (line !== source) {
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

        const carry = state.flags.C ? 1 : 0;

        const { result: intermediateResult } = addition(
          accumulatorValue,
          operand
        );
        const { result, flags } = addition(intermediateResult, carry);

        dispatch(loadRegister({ register: "A", value: result }));
        dispatch(setFlags(flags));

        return location + INSTRUCTION_SIZE;
      },
    };
  };

  return {
    "8F": MakeADCInstruction("8F", "A"),
    "88": MakeADCInstruction("88", "B"),
    "89": MakeADCInstruction("89", "C"),
    "8A": MakeADCInstruction("8A", "D"),
    "8B": MakeADCInstruction("8B", "E"),
    "8C": MakeADCInstruction("8C", "H"),
    "8D": MakeADCInstruction("8D", "L"),
    "8E": MakeADCInstruction("8D", "M"),
  };
};
