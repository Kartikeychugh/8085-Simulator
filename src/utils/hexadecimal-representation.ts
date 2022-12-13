export const DecToHex = (num: Number) => {
  let hexRepresentation = num.toString(16);
  if (hexRepresentation.length > 4) {
    console.warn(`Overflow with input: ${num}`);
    hexRepresentation = "0";
  }

  return hexRepresentation.toUpperCase();
};

export const HexToDec = (num: string) => {
  const result = parseInt(num, 16);
  return isNaN(result) ? 0 : result;
};

export const representWithRadix = (num: string, radix: number) => {
  const radixArr = [...Array(radix)].map(() => "0").join("");
  const str = radixArr + num;
  return str.substring(str.length - radix);
};
