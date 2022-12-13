import { setMemoryLocation } from "../../../features/memory/memorySlice";
import {
  loadRegister,
  Registers,
  selectHLMemoryAddress,
} from "../../../features/registers/registerSlice";
import { InstructionType } from "../../supported-instructions";

export const MOV = (): { [key: string]: InstructionType } => {
  const MakeMOVInstruction = (
    opcode: string,
    rd: Registers | "M",
    rs: Registers | "M"
  ): InstructionType => {
    const INSTRUCTION_SIZE = 1;

    return {
      opcode,
      compiler: (line: string) => {
        if (!line.startsWith("MOV")) {
          return { compiled: false, compiledCode: null };
        }

        const registers = line.substring(3).trim().replace(" ", "");
        if (registers.length !== 3) {
          return { compiled: false, compiledCode: null };
        }

        if (registers[1] !== ",") {
          return { compiled: false, compiledCode: null };
        }

        const Rd = registers[0];
        const Rs = registers[2];

        if (Rd !== rd || Rs !== rs) {
          return { compiled: false, compiledCode: null };
        }

        return { compiled: true, compiledCode: [opcode] };
      },
      execute: (state, dispatch) => {
        const location = state.registers.PC;
        const sourceValue =
          rs === "M"
            ? state.memory[selectHLMemoryAddress(state)]
            : state.registers[rs];

        if (rd === "M") {
          dispatch(
            setMemoryLocation({
              location: selectHLMemoryAddress(state),
              value: sourceValue,
            })
          );
        } else {
          dispatch(loadRegister({ register: rd, value: sourceValue }));
        }

        return location + INSTRUCTION_SIZE;
      },
    };
  };

  return {
    "7F": MakeMOVInstruction("7F", "A", "A"),
    "78": MakeMOVInstruction("78", "A", "B"),
    "79": MakeMOVInstruction("79", "A", "C"),
    "7A": MakeMOVInstruction("7A", "A", "D"),
    "7B": MakeMOVInstruction("7B", "A", "E"),
    "7C": MakeMOVInstruction("7C", "A", "H"),
    "7D": MakeMOVInstruction("7D", "A", "L"),
    "7E": MakeMOVInstruction("7E", "A", "M"),

    "47": MakeMOVInstruction("47", "B", "A"),
    "40": MakeMOVInstruction("40", "B", "B"),
    "41": MakeMOVInstruction("41", "B", "C"),
    "42": MakeMOVInstruction("42", "B", "D"),
    "43": MakeMOVInstruction("43", "B", "E"),
    "44": MakeMOVInstruction("44", "B", "H"),
    "45": MakeMOVInstruction("45", "B", "L"),
    "46": MakeMOVInstruction("46", "B", "M"),

    "4F": MakeMOVInstruction("4F", "C", "A"),
    "48": MakeMOVInstruction("48", "C", "B"),
    "49": MakeMOVInstruction("49", "C", "C"),
    "4A": MakeMOVInstruction("4A", "C", "D"),
    "4B": MakeMOVInstruction("4B", "C", "E"),
    "4C": MakeMOVInstruction("4C", "C", "H"),
    "4D": MakeMOVInstruction("4D", "C", "L"),
    "4E": MakeMOVInstruction("4E", "C", "M"),

    "57": MakeMOVInstruction("57", "D", "A"),
    "50": MakeMOVInstruction("50", "D", "B"),
    "51": MakeMOVInstruction("51", "D", "C"),
    "52": MakeMOVInstruction("52", "D", "D"),
    "53": MakeMOVInstruction("53", "D", "E"),
    "54": MakeMOVInstruction("54", "D", "H"),
    "55": MakeMOVInstruction("55", "D", "L"),
    "56": MakeMOVInstruction("56", "D", "M"),

    "5F": MakeMOVInstruction("5F", "E", "A"),
    "58": MakeMOVInstruction("58", "E", "B"),
    "59": MakeMOVInstruction("59", "E", "C"),
    "5A": MakeMOVInstruction("5A", "E", "D"),
    "5B": MakeMOVInstruction("5B", "E", "E"),
    "5C": MakeMOVInstruction("5C", "E", "H"),
    "5D": MakeMOVInstruction("5D", "E", "L"),
    "5E": MakeMOVInstruction("5E", "E", "M"),

    "67": MakeMOVInstruction("67", "H", "A"),
    "60": MakeMOVInstruction("60", "H", "B"),
    "61": MakeMOVInstruction("61", "H", "C"),
    "62": MakeMOVInstruction("62", "H", "D"),
    "63": MakeMOVInstruction("63", "H", "E"),
    "64": MakeMOVInstruction("64", "H", "H"),
    "65": MakeMOVInstruction("65", "H", "L"),
    "66": MakeMOVInstruction("66", "H", "M"),

    "6F": MakeMOVInstruction("6F", "L", "A"),
    "68": MakeMOVInstruction("68", "L", "B"),
    "69": MakeMOVInstruction("69", "L", "C"),
    "6A": MakeMOVInstruction("6A", "L", "D"),
    "6B": MakeMOVInstruction("6B", "L", "E"),
    "6C": MakeMOVInstruction("6C", "L", "H"),
    "6D": MakeMOVInstruction("6D", "L", "L"),
    "6E": MakeMOVInstruction("6E", "L", "M"),

    "77": MakeMOVInstruction("77", "M", "A"),
    "70": MakeMOVInstruction("70", "M", "B"),
    "71": MakeMOVInstruction("71", "M", "C"),
    "72": MakeMOVInstruction("72", "M", "D"),
    "73": MakeMOVInstruction("73", "M", "E"),
    "74": MakeMOVInstruction("74", "M", "H"),
    "75": MakeMOVInstruction("75", "M", "L"),
  };
};
