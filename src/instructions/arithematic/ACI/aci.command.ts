import { setFlags } from "../../../features/flags/flagSlice";
import { loadRegister } from "../../../features/registers/registerSlice";
import { InstructionType } from "../../supported-instructions";
import { addition } from "../../../utils/addition";
import { HexToDec } from "../../../utils/hexadecimal-representation";
import { readNumber } from "../../../utils/reading-numbers";

export const useABC = (): { [key: string]: InstructionType } => {
  const MakeABCInstruction = (opcode: string): InstructionType => {
    const INSTRUCTION_SIZE = 1;
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        return { compiled: false, compiledCode: null };
      },
      execute: (state, dispatch) => {
        const location = state.registers.PC;
        return location + INSTRUCTION_SIZE;
      },
    };
  };

  return {
    CE: MakeABCInstruction("CE"),
  };
};

export const ACI = (): { [key: string]: InstructionType } => {
  const MakeACIInstruction = (opcode: string): InstructionType => {
    const INSTRUCTION_SIZE = 2;
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (!line.startsWith("ACI")) {
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
        const carry = state.flags.C ? 1 : 0;

        const { result: intermediateResult } = addition(
          accumulatorValue,
          value
        );

        const { result, flags } = addition(intermediateResult, carry);

        dispatch(loadRegister({ register: "A", value: result }));
        dispatch(setFlags(flags));

        return location + INSTRUCTION_SIZE;
      },
    };
  };

  return {
    CE: MakeACIInstruction("CE"),
  };
};
