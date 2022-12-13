import { setFlags } from "../../../features/flags/flagSlice";
import {
  loadRegister,
  Registers,
  selectHLMemoryAddress,
} from "../../../features/registers/registerSlice";
import { InstructionType } from "../../supported-instructions";
import { addition } from "../../../utils/addition";

export const ADD = (): { [key: string]: InstructionType } => {
  const MakeADDInstruction = (
    opcode: string,
    source: Registers | "M"
  ): InstructionType => {
    const INSTRUCTION_SIZE = 1;
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (!line.startsWith("ADD")) {
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

        const { result, flags } = addition(accumulatorValue, operand);

        dispatch(loadRegister({ register: "A", value: result }));
        dispatch(setFlags(flags));

        return location + INSTRUCTION_SIZE;
      },
    };
  };

  return {
    "87": MakeADDInstruction("87", "A"),
    "80": MakeADDInstruction("80", "B"),
    "81": MakeADDInstruction("81", "C"),
    "82": MakeADDInstruction("82", "D"),
    "83": MakeADDInstruction("83", "E"),
    "84": MakeADDInstruction("84", "H"),
    "85": MakeADDInstruction("85", "L"),
    "86": MakeADDInstruction("86", "M"),
  };
};
