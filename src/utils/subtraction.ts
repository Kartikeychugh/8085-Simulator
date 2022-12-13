import { addition } from "./addition";
import { complement } from "./complement";

export const subtraction = (num1: number, num2: number) => {
  let num2OnesComplement = complement(num2, 8);
  const { result: num2TwoesComplement } = addition(num2OnesComplement, 1);

  const { result, flags } = addition(num1, num2TwoesComplement);
  return {
    result,
    flags: {
      ...flags,
      C: !flags.C,
    },
  };
};
