import { setFlag } from "../../../features/flags/flagSlice";
import {
  loadRegister,
  Registers,
  selectHLMemoryAddress,
} from "../../../features/registers/registerSlice";
import { InstructionType } from "../../supported-instructions";
import { subtraction } from "../../../utils/subtraction";
import { setMemoryLocation } from "../../../features/memory/memorySlice";

export const DCR = (): { [key: string]: InstructionType } => {
  const MakeDCRInstruction = (
    opcode: string,
    source: Registers | "M"
  ): InstructionType => {
    const INSTRUCTION_SIZE = 1;
    return {
      opcode,
      compiler: (line: string) => {
        line = line.trim();
        if (!line.startsWith("DCR")) {
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

        const { result, flags } = subtraction(operand, 1);
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
    "3D": MakeDCRInstruction("3D", "A"),
    "05": MakeDCRInstruction("05", "B"),
    "0D": MakeDCRInstruction("0D", "C"),
    "15": MakeDCRInstruction("15", "D"),
    "1D": MakeDCRInstruction("1D", "E"),
    "25": MakeDCRInstruction("25", "H"),
    "2D": MakeDCRInstruction("2D", "L"),
    "35": MakeDCRInstruction("35", "M"),
  };
};
