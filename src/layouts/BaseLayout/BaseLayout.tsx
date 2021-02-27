import React from 'react';
import Head from 'next/head';
import cx from 'classnames';

import { SEO } from '@utils/defaults';
import { Header } from '@components/common/Header';

import s from './BaseLayout.module.sass';

interface BaseLayoutProps {
  className?: string;
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({
  className,
  children,
  title,
  description,
  keywords,
  image,
}) => {
  const defaultTitle = SEO.DEFAULT_TITLE;
  const defaultDescription = SEO.DEFAULT_DESSCRIPTION;
  const defaultImage = SEO.DEFAULT_IMAGE;
  const templatedTitle = (titleInner: string) => (SEO.TEMPLATE_TITLE ? `${titleInner} | ${SEO.TEMPLATE_TITLE}` : titleInner);
  const finalTitle = title ? templatedTitle(title) : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalImage = `${SEO.WEBSITE_URL}${image || defaultImage}`;

  return (
    <>
      <Head>
        {/* Fonts */}
        <link
          rel="preload"
          href="/fonts/HKGrotesk/HKGrotesk-Regular.ttf"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/HKGrotesk/HKGrotesk-SemiBold.ttf"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/HKGrotesk/HKGrotesk-Black.ttf"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/DonutQuest/DonutQuest-Black.ttf"
          as="font"
          crossOrigin=""
        />
        {/* Favicons */}
        <link
          rel="icon"
          href="/favicon-32x32.png"
          type="image/png"
        />
        <link
          rel="apple-touch-icon"
          sizes="48x48"
          href="/icons/icon-48x48.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/icons/icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="96x96"
          href="/icons/icon-96x96.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/icons/icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="192x192"
          href="/icons/icon-192x192.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="256x256"
          href="/icons/icon-256x256.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="384x384"
          href="/icons/icon-384x384.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="512x512"
          href="/icons/icon-512x512.png"
        />
        {/* Seo */}
        <title>
          {finalTitle}
        </title>
        <meta name="description" content={finalDescription} />
        {keywords && <meta property="keywords" content={keywords} />}
        <meta property="image" content={finalImage} />
        <meta property="og:title" content={finalTitle} />
        <meta property="og:description" content={finalDescription} />
        <meta property="og:image" content={finalImage} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content={SEO.CREATOR} />
        <meta name="twitter:title" content={finalTitle} />
        <meta name="twitter:description" content={finalDescription} />
        <meta property="twitter:image" content={finalImage} />
      </Head>
      {/* Content */}
      <Header />
      <main className={cx(s.root, className)}>
        {children}
      </main>
      {/* TODO: Footer */}
    </>
  );
};
