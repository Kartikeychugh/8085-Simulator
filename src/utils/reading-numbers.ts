export const readNumber = (value: string) => {
  const isHexRepresentation = value[value.length - 1].toUpperCase() === "H";
  return isHexRepresentation
    ? readHexadecimalNumber(value)
    : readDecimalNumber(value);
};

export const readHexadecimalNumber = (value: string) => {
  value = value.substring(0, value.length - 1);
  if (!isValidHex(value)) {
    return { valid: false, value: null };
  }

  return { valid: true, value };
};

export const readDecimalNumber = (value: string) => {
  if (!isValidDec(value)) {
    return { valid: false, value: null };
  }

  return { valid: true, value: parseInt(value).toString(16) };
};

export const isValidHex = (num: string) => {
  let index = num.length;
  for (let i = 0; i < num.length; i++) {
    if (num.charAt(i) !== "0") {
      index = i;
      break;
    }
  }
  num = num.substring(index);

  if (num === "") {
    return true;
  }

  const dec = parseInt(num, 16);
  return dec.toString(16).toUpperCase() === num.toUpperCase();
};

export const isValidDec = (num: string) => {
  return num === parseInt(num).toString(10);
};
