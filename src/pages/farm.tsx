import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextSeo } from 'next-seo';

import { BaseLayout } from '@layouts/BaseLayout';
import { FarmContent } from '@components/farm/FarmContent';

const Farm: React.FC = () => {
  const { t } = useTranslation(['farm']);

  return (
    <BaseLayout>
      <NextSeo
        title={t('farm:Token page')}
        description={t('farm:Token page description. Couple sentences...')}
        openGraph={{
          title: t('farm:Token page'),
          description: t('farm:Token page description. Couple sentences...'),
        }}
      />
      <FarmContent />
    </BaseLayout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'farm']),
  },
});

export default Farm;
