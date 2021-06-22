export const uintToString = (stringOfUint: any) => {
  let str = '';
  for (let n = 0; n < stringOfUint.length; n += 2) {
    str += String.fromCharCode(parseInt(stringOfUint.substr(n, 2), 16));
  }
  return str;
};
