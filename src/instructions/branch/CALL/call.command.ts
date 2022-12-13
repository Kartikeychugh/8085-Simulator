import { RootState } from "../../../app/store";
import { setMemoryLocation } from "../../../features/memory/memorySlice";
import { loadRegister } from "../../../features/registers/registerSlice";
import {
  DecToHex,
  HexToDec,
  representWithRadix,
} from "../../../utils/hexadecimal-representation";
import { mergeBytes, splitIntoBytes } from "../../../utils/read-memory";
import { readNumber } from "../../../utils/reading-numbers";
import { InstructionType } from "../../supported-instructions";

export const CALL = (): { [key: string]: InstructionType } => {
  const INSTRUCTION_SIZE = 3;

  const MakeCALLInstruction = (
    opcode: string,
    code: string,
    condition: (state: RootState) => boolean
  ): InstructionType => {
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (!line.startsWith(code)) {
          return { compiled: false, compiledCode: null };
        }

        line = line.substring(4).trim();
        const result = readNumber(line);
        if (!result.valid) {
          return { compiled: false, compiledCode: null };
        }

        if (HexToDec(result.value!) > HexToDec("FFFF")) {
          return { compiled: false, compiledCode: null };
        }

        const address = representWithRadix(result.value!, 4);
        const lowBits = address.substring(2);
        const highBits = address.substring(0, 2);

        return { compiled: true, compiledCode: [opcode, lowBits, highBits] };
      },
      execute: (state, dispatch, stack) => {
        const location = state.registers.PC;

        if (condition(state)) {
          const SP = state.registers.SP;

          const lowBitsRoutineAddress = state.memory[location + 1];
          const highBitsRoutineAddress = state.memory[location + 2];

          const [highBitsReturnAddress, lowBitsReturnAddress] = splitIntoBytes(
            location + 3
          );

          const routineAddress = mergeBytes(
            highBitsRoutineAddress,
            lowBitsRoutineAddress
          );
          dispatch(
            setMemoryLocation({
              location: SP - 1,
              value: highBitsReturnAddress,
            })
          );
          dispatch(
            setMemoryLocation({ location: SP - 2, value: lowBitsReturnAddress })
          );
          dispatch(loadRegister({ register: "SP", value: SP - 2 }));
          return routineAddress;
        } else {
          return location + INSTRUCTION_SIZE;
        }
      },
    };
  };

  return {
    CD: MakeCALLInstruction("CD", "CALL", () => true),
    C4: MakeCALLInstruction("C4", "CNZ", (state) => !state.flags.Z),
    CC: MakeCALLInstruction("CC", "CZ", (state) => state.flags.Z),
    D4: MakeCALLInstruction("D4", "CNC", (state) => !state.flags.C),
    DC: MakeCALLInstruction("DC", "CC", (state) => state.flags.C),
    E4: MakeCALLInstruction("E4", "CPO", (state) => !state.flags.P),
    EC: MakeCALLInstruction("EC", "CPE", (state) => state.flags.P),
    F4: MakeCALLInstruction("F4", "CP", (state) => !state.flags.S),
    FC: MakeCALLInstruction("FC", "CM", (state) => state.flags.S),
  };
};
