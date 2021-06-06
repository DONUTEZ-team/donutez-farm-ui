import { IPFS } from '@utils/defaults';

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

export const uintToString = (stringOfUint: any) => {
  let str = '';
  for (let n = 0; n < stringOfUint.length; n += 2) {
    str += String.fromCharCode(parseInt(stringOfUint.substr(n, 2), 16));
  }
  return str;
};

export const getTokenLogo = (url: string | null) => {
  if (!url) {
    return null;
  }

  const splitLink = url.split('://');
  const getProtocol: string = splitLink && splitLink.length ? splitLink[0] : '';
  const isIpfs = getProtocol === IPFS;

  if (isIpfs) {
    return `https://ipfs.io/ipfs/${splitLink[1]}`;
  }
  if (url.match(/\.(jpeg|jpg|gif|png)$/) !== null) {
    return url;
  }

  return null;
};
