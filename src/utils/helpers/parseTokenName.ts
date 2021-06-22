export const parseTokenName = (value: string) => {
  const onlyChars = value.length < 2
    ? value.trim().replace(/[^ a-zA-Z]+/g, '')
    : value.replace(/[^ a-zA-Z]+/g, '');
  return onlyChars.length > 20 ? onlyChars.slice(0, 20) : onlyChars;
};
