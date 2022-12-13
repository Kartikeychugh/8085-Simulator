import { setMemoryLocation } from "../../../features/memory/memorySlice";
import { loadRegister } from "../../../features/registers/registerSlice";
import {
  DecToHex,
  HexToDec,
  representWithRadix,
} from "../../../utils/hexadecimal-representation";
import { mergeBytes } from "../../../utils/read-memory";
import { readNumber } from "../../../utils/reading-numbers";
import { InstructionType } from "../../supported-instructions";

export const CALL = (): { [key: string]: InstructionType } => {
  const MakeCALLInstruction = (opcode: string): InstructionType => {
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (!line.startsWith("CALL")) {
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
        const SP = state.registers.SP;

        const lowBitsRoutineAddress = state.memory[location + 1];
        const highBitsRoutineAddress = state.memory[location + 2];

        const routineAddress = mergeBytes(
          highBitsRoutineAddress,
          lowBitsRoutineAddress
        );

        const returnLocation = representWithRadix(DecToHex(location + 3), 4);
        const highBitsReturnAddress = HexToDec(returnLocation.substring(0, 2));
        const lowBitsReturnAddress = HexToDec(returnLocation.substring(2));

        dispatch(
          setMemoryLocation({ location: SP - 1, value: highBitsReturnAddress })
        );
        dispatch(
          setMemoryLocation({ location: SP - 2, value: lowBitsReturnAddress })
        );
        dispatch(loadRegister({ register: "SP", value: SP - 2 }));

        return routineAddress;
      },
    };
  };

  return {
    CD: MakeCALLInstruction("CD"),
  };
};
