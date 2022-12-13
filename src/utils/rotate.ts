import { BinaryToDec, DecToBinary } from "./binary-representation";

export const rotateLeft = (num1: number, radix: number) => {
  const binary = DecToBinary(num1, radix);
  const msb = binary[0];
  const rotated = binary.substring(1) + msb;
  return {
    result: BinaryToDec(rotated),
    flags: { C: msb === "1" ? true : false },
  };
};

export const rotateRight = (num1: number, radix: number) => {
  const binary = DecToBinary(num1, radix);
  const lsb = binary[radix - 1];
  const rotated = lsb + binary.substring(0, radix - 1);
  return {
    result: BinaryToDec(rotated),
    flags: { C: lsb === "1" ? true : false },
  };
};

export const rotateLeftWithCarry = (
  num1: number,
  carry: number,
  radix: number
) => {
  const binary = DecToBinary(num1, radix);
  const msb = binary[0];
  const rotated = binary.substring(1) + carry;
  return {
    result: BinaryToDec(rotated),
    flags: { C: msb === "1" ? true : false },
  };
};

export const rotateRightWithCarry = (
  num1: number,
  carry: number,
  radix: number
) => {
  const binary = DecToBinary(num1, radix);
  const lsb = binary[radix - 1];
  const rotated = carry + binary.substring(0, radix - 1);
  return {
    result: BinaryToDec(rotated),
    flags: { C: lsb === "1" ? true : false },
  };
};
