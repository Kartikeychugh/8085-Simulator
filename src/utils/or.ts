import { BinaryToDec, DecToBinary } from "./binary-representation";

export const performOR = (num1: number, num2: number) => {
  let a = DecToBinary(num1, 8);
  let b = DecToBinary(num2, 8);
  const c = [];
  let ones = 0;
  let zero = true;

  for (let i = 0; i < 8; i++) {
    const num1 = parseInt(a[i], 2);
    const num2 = parseInt(b[i], 2);
    c[i] = num1 | num2;
    if (c[i]) {
      ones++;
      zero = false;
    }
  }

  const resultInBinary = c.join("");
  const resultInDec = BinaryToDec(resultInBinary);
  const flags = {
    Z: zero,
    C: false,
    P: ones % 2 === 0,
    S: resultInBinary[0] === "1",
  };

  return { result: resultInDec, flags };
};
