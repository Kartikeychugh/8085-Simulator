export const addition = (num1: number, num2: number) => {
  let a = "00000000" + num1.toString(2);
  let b = "00000000" + num2.toString(2);
  a = a.substring(a.length - 8);
  b = b.substring(b.length - 8);

  let c = "";
  let carry = 0;
  let ones = 0;

  for (let i = 7; i >= 0; i--) {
    const bitA: number = parseInt(a[i], 10);
    const bitB: number = parseInt(b[i], 10);
    const sum = bitA + bitB + carry;
    if (sum < 2) {
      c += sum;
      carry = 0;
    } else if (sum === 2) {
      c += "0";
      carry = 1;
    } else if (sum === 3) {
      c += "1";
      carry = 1;
    }

    if (c[c.length - 1] === "1") ones++;
  }

  c = c.split("").reverse().join("");
  const flags = {
    C: !!carry,
    S: !!parseInt(c[0]),
    Z: parseInt(c, 2) === 0,
    P: ones % 2 === 0,
  };

  return { result: parseInt(c, 2), flags };
};
