import { IPFS } from '@utils/defaults';

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
