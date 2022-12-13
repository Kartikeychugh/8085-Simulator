export const DecToBinary = (num: number, bits: number) => {
  const binary = [...Array(bits)].map(() => "0").join("") + num.toString(2);

  return binary.substring(binary.length - bits);
};

export const BinaryToDec = (num: string) => {
  return parseInt(num, 2);
};
