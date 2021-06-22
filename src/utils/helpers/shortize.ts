export const shortize = (str: string, decimal?: number) => `${str.slice(0, decimal ?? 4)}...${str.slice(-4)}`;
