import { setMemoryLocation } from "../../../features/memory/memorySlice";
import { loadRegister } from "../../../features/registers/registerSlice";
import { InstructionType } from "../../supported-instructions";
import { mergeBytes } from "../../../utils/read-memory";

export const RET = (): { [key: string]: InstructionType } => {
  const MakeRETInstruction = (opcode: string): InstructionType => {
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (line !== "RET") {
          return { compiled: false, compiledCode: null };
        }

        return { compiled: true, compiledCode: [opcode] };
      },
      execute: (state, dispatch, stack) => {
        const SP = state.registers.SP;
        const lowBitsReturnAddress = state.memory[SP];
        const highBitsReturnAddress = state.memory[SP + 1];
        const address = mergeBytes(highBitsReturnAddress, lowBitsReturnAddress);
        dispatch(setMemoryLocation({ location: SP, value: 0 }));
        dispatch(setMemoryLocation({ location: SP + 1, value: 0 }));
        dispatch(loadRegister({ register: "SP", value: SP + 2 }));

        return address;
      },
    };
  };

  return {
    C9: MakeRETInstruction("C9"),
  };
};
