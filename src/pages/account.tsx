import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import cx from 'classnames';
import { useTranslation } from '@i18n';
import { useAccountPkh } from '@utils/dapp';

import { BaseLayout } from '@layouts/BaseLayout';
import { Container } from '@ui/Container';
import { Row } from '@ui/Row';
import { Button } from '@ui/Button';
import { Heading } from '@components/common/Heading';

import s from '@styles/Account.module.sass';
import { BACKEND_URL } from '@utils/defaults';

type TokensType = {
  loading: boolean
  data: {
    user: string
    token: string
    type: 'FA12' | 'FA2'
  }[] | []
};

type YFSType = {
  loading: boolean
  data: {
    user: string
    yf: string
    title: string
    description: string
  }[] | []
};

const Account = () => {
  const { t } = useTranslation(['common', 'account']);

  const [tokens, setTokens] = useState<TokensType>({
    loading: true,
    data: [],
  });
  const [yfs, setYfs] = useState<YFSType>({
    loading: true,
    data: [],
  });

  const accountPkh = useAccountPkh();

  useEffect(() => {
    if (accountPkh) {
      fetch(`${BACKEND_URL}/tokens/${accountPkh}/`)
        .then((response) => response.json())
        .then((data) => setTokens({ data, loading: false }))
        .catch((err) => console.log(err));
      fetch(`${BACKEND_URL}/yfs/${accountPkh}/`)
        .then((response) => response.json())
        .then((data) => setYfs({ data, loading: false }))
        .catch((err) => console.log(err));
    }
  }, [accountPkh]);

  return (
    <BaseLayout>
      <Container>
        <Row className={s.row}>
          {yfs.data.length <= 0 && tokens.data.length <= 0 && (
            <div className={s.outer}>
              <Heading header={'You have no\navailable data'} subheader="Ooops..." />
              <div className={s.buttons}>
                <Button
                  className={s.button}
                  href="/"
                >
                  {t('account:Create farm')}
                </Button>
                <Button
                  className={s.button}
                  theme="secondary"
                  href="/token"
                >
                  {t('account:Create token')}
                </Button>
              </div>
            </div>
          )}
          {yfs.data.length > 0 && (
            <div className={s.outer}>
              <Heading header="Your Yield Farmings" subheader="" />
              {yfs.data.map((farm: any, index: number) => (
                <div className={s.farm} key={farm.yf}>
                  <span className={s.number}>
                    {index + 1}
                    .
                  </span>
                  <div className={cx(s.token, s.farmInner)}>
                    <strong>
                      {t('account:Your token')}
                      :
                    </strong>
                    {' '}
                    {farm.yf}
                  </div>
                  <div className={cx(s.token, s.farmInner)}>
                    <strong>
                      {t('account:Your website')}
                      :
                    </strong>
                    {' '}
                    <Link href={`/yield-farmings/${farm.yf}`}>
                      {`https://www.donutez-farm.vercel.app/yield-farmings/${farm.yf}`}
                    </Link>
                  </div>
                  {farm.title && (
                    <div className={cx(s.token, s.farmInner)}>
                      <strong>
                        {t('account:Website Title')}
                        :
                      </strong>
                      {' '}
                      {farm.title}
                    </div>
                  )}
                  {farm.description && (
                    <div className={cx(s.token, s.farmInner)}>
                      <strong>
                        {t('account:Website Description')}
                        :
                      </strong>
                      {' '}
                      {farm.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {tokens.data.length > 0 && (
            <div className={s.outer}>
              <Heading header={'Your FA 1.2 / 2\nTokens'} subheader="FA" />
              {tokens.data.map((token: any, index: number) => (
                <div className={s.farm} key={token.token}>
                  <span className={s.number}>{index + 1}</span>
                  <div className={cx(s.token, s.farmInner)}>
                    <strong>
                      {t('account:Your token')}
                      :
                    </strong>
                    {' '}
                    <a href={`https://better-call.dev/delphinet/${token.token}`}>
                      {token.token}
                    </a>
                  </div>
                  <div className={cx(s.token, s.farmInner)}>
                    <strong>
                      {t('account:Token type')}
                      :
                    </strong>
                    {' '}
                    {token.type === 'FA12' ? 'FA 1.2' : 'FA 2'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Row>
      </Container>
    </BaseLayout>
  );
};

Account.getInitialProps = async () => ({
  namespacesRequired: ['common', 'account'],
});

export default Account;
