import { representWithRadix } from "./hexadecimal-representation";

export const complement = (num: number, radix: number) => {
  const binary = representWithRadix(num.toString(2), radix);
  let c = "";
  for (let i = 0; i < binary.length; i++) {
    c += binary[i] === "1" ? "0" : "1";
  }

  return parseInt(c, 2);
};
