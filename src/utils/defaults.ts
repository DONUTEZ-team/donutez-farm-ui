export const SEO = {
  DEFAULT_TITLE: 'DONUTEZ FARM | Create your own yeild farming in 5 minutes',
  DEFAULT_DESSCRIPTION: 'DEFAULT DESCRIPTION',
  DEFAULT_IMAGE: 'og_image.jpg',
  TEMPLATE_TITLE: 'DONUTEZ FARM',
  WEBSITE_URL: 'https://donutez-farm.vercel.app/', // Slash in the end is necessary
  CREATOR: '@donutez',
};

export enum NetworkType {
  MAINNET = 'mainnet',
  DELPHINET = 'delphinet',
  EDONET = 'edonet',
  CUSTOM = 'custom',
}

export const APP_NAME = 'DONUTEZ FARM';

export const NETWORK = NetworkType.DELPHINET;
export const NETWORK_RPC = 'https://api.tez.ie/rpc/delphinet';
