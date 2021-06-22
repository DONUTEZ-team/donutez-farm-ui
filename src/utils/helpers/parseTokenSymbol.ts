export const parseTokenSymbol = (value: string) => {
  const onlyChars = value.replace(/[^a-zA-Z]+/g, '');
  const newValue = onlyChars.length > 6 ? onlyChars.slice(0, 6) : onlyChars;
  return newValue.toUpperCase();
};
