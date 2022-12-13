import { setFlags } from "../../../features/flags/flagSlice";
import {
  loadRegister,
  Registers,
  selectHLMemoryAddress,
} from "../../../features/registers/registerSlice";
import { InstructionType } from "../../supported-instructions";
import { performAND } from "../../../utils/and";
import { readNumber } from "../../../utils/reading-numbers";
import { HexToDec } from "../../../utils/hexadecimal-representation";
import { performXOR } from "../../../utils/xor";
import { performOR } from "../../../utils/or";

export const ORI = (): { [key: string]: InstructionType } => {
  const MakeORIInstruction = (opcode: string): InstructionType => {
    const INSTRUCTION_SIZE = 2;
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (!line.startsWith("ORI")) {
          return { compiled: false, compiledCode: null };
        }

        line = line.substring(3).trim();
        const result = readNumber(line);
        if (!result.valid) {
          return { compiled: false, compiledCode: null };
        }

        if (HexToDec(result.value!) > HexToDec("FF")) {
          return { compiled: false, compiledCode: null };
        }

        return { compiled: true, compiledCode: [opcode, result.value!] };
      },
      execute: (state, dispatch) => {
        const location = state.registers.PC;
        const value = state.memory[location + 1];
        const accumulatorValue = state.registers.A;
        const { result, flags } = performOR(accumulatorValue, value);

        dispatch(loadRegister({ register: "A", value: result }));
        dispatch(setFlags(flags));

        return location + INSTRUCTION_SIZE;
      },
    };
  };

  return {
    F6: MakeORIInstruction("F6"),
  };
};
