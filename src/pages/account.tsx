import React, { useEffect } from 'react';
import { useTranslation } from '@i18n';

import { BaseLayout } from '@layouts/BaseLayout';
import { Container } from '@ui/Container';
import { Row } from '@ui/Row';

import s from '@styles/Account.module.sass';
import { Heading } from '@components/common/Heading';
import Link from 'next/link';
import { useAccountPkh } from '@utils/dapp';

const Account = () => {
  const { t, i18n } = useTranslation(['common', 'ui-kit']);
  const accountPkh = useAccountPkh();

  useEffect(() => {
    fetch(`https://sleepy-tor-46627.herokuapp.com/core/tokens/${accountPkh}`)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }, [accountPkh]);

  return (
    <BaseLayout>
      <Container>
        <Row className={s.row}>
          <div className={s.outer}>
            <Heading header="Your Yield Farmings" subheader="" />
          </div>
          <div className={s.outer}>
            <Heading header="Your FA 1.2 Tokens" subheader="FA 1.2" />
            <div className={s.block}>
              <a href="https://www.google.com" className={s.token}>asdf</a>
              <a href="https://www.google.com" className={s.token}>asdf</a>
            </div>
          </div>
          <div className={s.outer}>
            <Heading header="Your FA 2 Tokens" subheader="FA 2" />
            <div className={s.block}>
              <a href="https://www.google.com" className={s.token}>asdf</a>
              <a href="https://www.google.com" className={s.token}>asdf</a>
            </div>
          </div>
        </Row>
      </Container>
    </BaseLayout>
  );
};

Account.getInitialProps = async () => ({
  namespacesRequired: ['common', 'account'],
});

export default Account;
