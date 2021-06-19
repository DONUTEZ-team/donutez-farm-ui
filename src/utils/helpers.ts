import { IPFS } from '@utils/defaults';
import { Batch, TransferParams } from '@utils/types';

export const batchify = (
  batch: Batch, transfers: TransferParams[],
) => (
  transfers.reduce((b, tParams) => b.withTransfer(tParams), batch)
);

export const parseNumber = (value: string, min: number, max: number) => {
  // leave only numbers
  const onlyNums = value.replace(/[^0-9]/g, '');

  // if no numbers return empty
  if (onlyNums === '') return '';
  // if less then min return min
  if (+onlyNums < min) {
    return min.toString();
  }
  // if greater then max return max
  if (+onlyNums > max) {
    return max.toString();
  }

  // else return number
  return onlyNums;
};

export const parseTokenName = (value: string) => {
  const onlyChars = value.length < 2
    ? value.trim().replace(/[^ a-zA-Z]+/g, '')
    : value.replace(/[^ a-zA-Z]+/g, '');
  return onlyChars.length > 20 ? onlyChars.slice(0, 20) : onlyChars;
};

export const parseTokenSymbol = (value: string) => {
  const onlyChars = value.replace(/[^a-zA-Z]+/g, '');
  const newValue = onlyChars.length > 6 ? onlyChars.slice(0, 6) : onlyChars;
  return newValue.toUpperCase();
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

export const convertToSeconds = (
  days?: string | number,
  hours?: string | number,
  minutes?: string | number,
  seconds?: string | number,
) => (
  (days ? +days : 1) * 86400
  + (hours ? +hours : 0) * 3600
  + (minutes ? +minutes : 0) * 60
  + (seconds ? +seconds : 0)
);

export const formatName = (name: string) => (
  name.trim().replaceAll(' ', '_')
);

enum AcceptedImageTypes {
  'image/jpeg' = '.jpg',
  'image/png' = '.png',
}

export const formatImageType = (type: string) => (
  AcceptedImageTypes[type as keyof typeof AcceptedImageTypes]
);

export const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
