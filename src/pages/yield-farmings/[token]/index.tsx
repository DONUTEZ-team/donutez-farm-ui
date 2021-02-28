import React, {
  useEffect, useState,
} from 'react';
import cx from 'classnames';
import {
  useAccountPkh,
  useTezos,
} from '@utils/dapp';
import { BACKEND_URL } from '@utils/defaults';

import s from '@styles/FarmUsers.module.sass';
import { ConnectWalletUser } from '@containers/ConnectWalletUser';
import { useRouter } from 'next/router';
import { Inner } from '@components/users/Inner';
import NotFound from '../../404';

const Farm = () => {
  const router = useRouter();
  const { token } = router.query;

  const [yfs, setYfs] = useState(true);

  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  useEffect(() => {
    fetch(`${BACKEND_URL}/yfs/`)
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter((item: any) => item.yf === token);
        setYfs(filteredData.length !== 0);
      })
      .catch((err) => console.log(err));
  }, [token]);

  if (!yfs) {
    return <NotFound />;
  }

  if (!tezos || !accountPkh) {
    return (
      <div className={cx(s.wrapper, s.empty)}>
        <ConnectWalletUser />
      </div>
    );
  }

  return (
    <Inner />
  );
};

Farm.getInitialProps = async () => ({
  namespacesRequired: ['common', 'farm'],
});

export default Farm;
