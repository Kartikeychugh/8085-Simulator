import { setMemoryLocation } from "../../../features/memory/memorySlice";
import { loadRegister } from "../../../features/registers/registerSlice";
import { InstructionType } from "../../supported-instructions";
import { mergeBytes } from "../../../utils/read-memory";
import { RootState } from "../../../app/store";

export const RET = (): { [key: string]: InstructionType } => {
  const INSTRUCTION_SIZE = 1;

  const MakeRETInstruction = (
    opcode: string,
    code: string,
    condition: (state: RootState) => boolean
  ): InstructionType => {
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (line !== code) {
          return { compiled: false, compiledCode: null };
        }

        return { compiled: true, compiledCode: [opcode] };
      },
      execute: (state, dispatch, stack) => {
        const location = state.registers.PC;

        if (condition(state)) {
          const SP = state.registers.SP;
          const lowBitsReturnAddress = state.memory[SP];
          const highBitsReturnAddress = state.memory[SP + 1];
          const address = mergeBytes(
            highBitsReturnAddress,
            lowBitsReturnAddress
          );
          dispatch(setMemoryLocation({ location: SP, value: 0 }));
          dispatch(setMemoryLocation({ location: SP + 1, value: 0 }));
          dispatch(loadRegister({ register: "SP", value: SP + 2 }));

          return address;
        } else {
          return location + INSTRUCTION_SIZE;
        }
      },
    };
  };

  return {
    C9: MakeRETInstruction("C9", "RET", () => true),
    C0: MakeRETInstruction("C0", "RNZ", (state) => !state.flags.Z),
    C8: MakeRETInstruction("C8", "RZ", (state) => state.flags.Z),
    D0: MakeRETInstruction("D0", "RNC", (state) => !state.flags.C),
    D8: MakeRETInstruction("D8", "RC", (state) => state.flags.C),
    E0: MakeRETInstruction("E0", "RPO", (state) => !state.flags.P),
    E8: MakeRETInstruction("E8", "RPE", (state) => state.flags.P),
    F0: MakeRETInstruction("F0", "RP", (state) => !state.flags.S),
    F8: MakeRETInstruction("F8", "RM", (state) => state.flags.S),
  };
};
