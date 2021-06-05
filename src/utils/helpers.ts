export const parseNumber = (value: string, min: number, max: number) => {
  // leave only numbers
  const onlyNums = value.replace(/[^\d]/g, '');

  // if no numbers return empty
  if (onlyNums === '') return null;
  // if less then min return min
  if (+onlyNums < min) {
    return min;
  }
  // if greater then max return max
  if (+onlyNums > max) {
    return max;
  }

  // else return number
  return +onlyNums;
};

export const shortize = (str: string, decimal?: number) => `${str.slice(0, decimal ?? 4)}...${str.slice(-4)}`;
