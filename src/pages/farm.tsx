import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import BigNumber from 'bignumber.js';
import { useTranslation } from '@i18n';
import {
  useAccountPkh,
  getStorage,
  useTezos,
  useOnBlock,
  getUserBalance,
} from '@utils/dapp';
import { getUserHarvest, harvest } from '@utils/farm';
import { CONTRACT_POOL, CONTRACT_REWARD } from '@utils/defaults';

import { BaseLayout } from '@layouts/BaseLayout';
import { Container } from '@ui/Container';
import { Row } from '@ui/Row';
import { Background } from '@components/farm/Background';
import { FarmCard } from '@components/farm/FarmCard';
import { OperationModal } from '@components/farm/Modal/Modal';
import DonutezIcon from '@icons/DONUTEZ_TOKEN.svg';
import TezosIcon from '@icons/TEZOS_TOKEN.svg';
import HandOkay from '@icons/HandOkay.svg';

import s from '@styles/Farm.module.sass';

const Farm = () => {
  const { t } = useTranslation(['common', 'farm']);

  // Context
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

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

  // Reload when new block
  if (tezos) { // Don't sure if necessary
    useOnBlock(tezos, loadStorage);
    useOnBlock(tezos, loadHarvest);
  }

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
    <BaseLayout className={s.wrapper}>
      <Background />
      <Container>
        <Row className={s.row}>
          <h1 className={s.header}>
            {t('farm:stake QP tokens to earn DONUTEZ')}
          </h1>
          <div className={s.cards}>
            <FarmCard
              className={s.card}
              firstIcon={<DonutezIcon />}
              prevValue={+prevCounter.current}
              value={+userHarvest}
              harvestHandler={harvestReward}
              type="harvest"
            />
            <FarmCard
              className={s.card}
              firstIcon={<DonutezIcon />}
              secondIcon={<TezosIcon />}
              value={+userStaked}
              balance={+userBalance}
              type="approve"
              openDepositHandler={(isStakeF) => openDepositHandler(isStakeF)}
            />
          </div>
          <HandOkay className={s.hand} />
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
    </BaseLayout>
  );
};

Farm.getInitialProps = async () => ({
  namespacesRequired: ['common', 'farm'],
});

export default Farm;
