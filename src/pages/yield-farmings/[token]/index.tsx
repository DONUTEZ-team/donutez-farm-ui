import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import cx from 'classnames';
import BigNumber from 'bignumber.js';
import {
  useAccountPkh,
  getStorage,
  useTezos,
  getUserBalance,
} from '@utils/dapp';
import { getUserHarvest, harvest } from '@utils/farm';
import { CONTRACT_POOL, CONTRACT_REWARD } from '@utils/defaults';

import { Container } from '@ui/Container';
import { Row } from '@ui/Row';
import XTokenIcon from '@icons/X_TOKEN.svg';
import TezosIcon from '@icons/TEZOS_TOKEN.svg';
import Donutez from '@icons/DONUTEZ.svg';

import s from '@styles/FarmUsers.module.sass';
import { Card } from '@components/users/Card';
import { ConnectWalletUser } from '@containers/ConnectWalletUser';
import { useRouter } from 'next/router';
import { OperationModal } from '@components/users/Modal';
import Link from 'next/link';

const Farm = () => {
  const router = useRouter();
  const { token } = router.query;
  console.log('token', token);

  // Context
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  if (!tezos || !accountPkh) {
    return (
      <div className={cx(s.wrapper, s.empty)}>
        <ConnectWalletUser />
      </div>
    );
  }

  // Necessary information for the cards: staked, balance, harvest
  const [userStaked, setUserStaked] = useState(new BigNumber(0));
  const [userBalance, setUserBalance] = useState(new BigNumber(0));
  const [userHarvest, setUserHarvest] = useState(new BigNumber(0));

  // Save old harvest value for counterUp
  const prevCounter = useRef(userHarvest);

  // Functions to load necessary information for the cards
  const loadStorage = useCallback(async () => {
    if (tezos && accountPkh) {
      const storageUserStaked = await getStorage(tezos, CONTRACT_REWARD, accountPkh);
      if (storageUserStaked) {
        setUserStaked(storageUserStaked.staked);
      }
      const storageUserBalance = await getUserBalance(tezos, CONTRACT_POOL, accountPkh);
      if (storageUserBalance) {
        setUserBalance(storageUserBalance);
      }
    }
  }, [accountPkh, tezos]);
  const loadHarvest = useCallback(async () => {
    if (tezos && accountPkh) {
      const storageUserHarvest = await getUserHarvest(
        tezos, CONTRACT_REWARD, accountPkh,
      );
      if (storageUserHarvest) { // Don't sure if necessary
        await setUserHarvest((userHarvestOld) => {
          if (!prevCounter.current.eq(userHarvestOld)) {
            prevCounter.current = userHarvestOld;
          }
          return storageUserHarvest;
        });
      }
    }
  }, [accountPkh, tezos]);

  // Load initial
  useEffect(() => {
    loadStorage();
  }, [loadStorage]);
  useEffect(() => {
    loadHarvest();
  }, [loadHarvest]);

  // // Reload when new block
  // if (tezos) { // Don't sure if necessary
  //   useOnBlock(tezos, loadStorage);
  //   useOnBlock(tezos, loadHarvest);
  // }

  // Modal logic
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isStake, setIsStake] = useState(true);
  const openDepositHandler = useCallback((isStakeF: boolean) => {
    setIsStake(isStakeF);
    setIsDepositOpen(true);
  }, []);

  // Harvest reward
  const harvestReward = useCallback(async () => {
    try {
      if (tezos && accountPkh) {
        await harvest(tezos, CONTRACT_REWARD);
      }
    } catch (e) {
      console.log(e);
    }
  }, [tezos, accountPkh]);

  return (
    <div className={s.wrapper}>
      <Link href="/">
        <a className={s.createdBy}>
          <Donutez className={s.createdIcon} />
          Created with
          <br />
          DONUTEZ FARM
        </a>
      </Link>
      <ConnectWalletUser className={s.connected} />
      <Container>
        <Row className={s.row}>
          <h1 className={s.header}>
            Stake QP tokens to earn XXX
          </h1>
          <div className={s.cards}>
            <Card
              className={s.card}
              firstIcon={<XTokenIcon />}
              value={+userHarvest}
              harvestHandler={harvestReward}
              type="harvest"
            />
            <Card
              className={s.card}
              firstIcon={<XTokenIcon />}
              secondIcon={<TezosIcon />}
              value={+userStaked}
              balance={+userBalance}
              type="approve"
              openDepositHandler={(isStakeF) => openDepositHandler(isStakeF)}
            />
          </div>
        </Row>
      </Container>
      <OperationModal
        availTokens={isStake ? userBalance : userStaked}
        isOpen={isDepositOpen}
        isStake={isStake}
        contractPool={CONTRACT_POOL}
        contractRewards={CONTRACT_REWARD}
        decimals={0}
        onRequestClose={() => setIsDepositOpen(false)}
      />
    </div>
  );
};

Farm.getInitialProps = async () => ({
  namespacesRequired: ['common', 'farm'],
});

export default Farm;
