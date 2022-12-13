import {
  HexToDec,
  representWithRadix,
  DecToHex,
} from "./hexadecimal-representation";

export const mergeBytes = (highBits: number, lowBits: number) => {
  return HexToDec(
    representWithRadix(DecToHex(highBits), 2) +
      representWithRadix(DecToHex(lowBits), 2)
  );
};

export const splitIntoBytes = (value: number) => {
  const resultInHex = representWithRadix(DecToHex(value), 4);
  const highBits = resultInHex.substring(0, 2);
  const lowBits = resultInHex.substring(2);

  return [HexToDec(highBits), HexToDec(lowBits)];
};
