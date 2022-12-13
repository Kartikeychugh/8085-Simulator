import { setFlag } from "../../../features/flags/flagSlice";
import {
  loadRegister,
  Registers,
  selectHLMemoryAddress,
} from "../../../features/registers/registerSlice";
import { InstructionType } from "../../supported-instructions";
import { addition } from "../../../utils/addition";
import { setMemoryLocation } from "../../../features/memory/memorySlice";

export const INR = (): { [key: string]: InstructionType } => {
  const MakeINRInstruction = (
    opcode: string,
    source: Registers | "M"
  ): InstructionType => {
    const INSTRUCTION_SIZE = 1;
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (!line.startsWith("INR")) {
          return { compiled: false, compiledCode: null };
        }

        line = line.substring(3).trim();
        if (line !== source) {
          return { compiled: false, compiledCode: null };
        }

        return { compiled: true, compiledCode: [opcode] };
      },
      execute: (state, dispatch) => {
        const memoryAddress = selectHLMemoryAddress(state);
        const operand =
          source === "M"
            ? state.memory[memoryAddress]
            : state.registers[source];

        const { result, flags } = addition(operand, 1);
        dispatch(setFlag({ flag: "C", value: flags.C }));

        if (source === "M") {
          dispatch(
            setMemoryLocation({
              location: memoryAddress,
              value: result,
            })
          );
        } else {
          dispatch(loadRegister({ register: source, value: result }));
        }

        return state.registers.PC + INSTRUCTION_SIZE;
      },
    };
  };

  return {
    "3C": MakeINRInstruction("3C", "A"),
    "04": MakeINRInstruction("04", "B"),
    "0C": MakeINRInstruction("0C", "C"),
    "14": MakeINRInstruction("14", "D"),
    "1C": MakeINRInstruction("1C", "E"),
    "24": MakeINRInstruction("24", "H"),
    "2C": MakeINRInstruction("2C", "L"),
    "34": MakeINRInstruction("34", "M"),
  };
};
