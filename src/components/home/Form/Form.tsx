import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import cx from 'classnames';
import { useTranslation } from '@i18n';
import { Field, withTypes } from 'react-final-form';
import { FormApi, getIn } from 'final-form';
import dayjs from 'dayjs';
// eslint-disable-next-line import/no-named-default
import focusDecorator from 'final-form-focus';
import Confetti from 'react-dom-confetti';
import {
  composeValidators,
  required,
  validateDay,
  validateHours,
  validateMinsSecs,
  validateSecs,
} from '@utils/validators';
import { getStorageInfo, useAccountPkh, useTezos } from '@utils/dapp';
import { createFarming } from '@utils/createFarming';
import {
  CONSTRUCT_FARM_CONTRACT,
  CONSTRUCT_FEE, CONSTRUCT_STAKE_FEE, CONSTRUCT_STAKE_SUM,
} from '@utils/defaults';

import { Container } from '@ui/Container';
import { Row } from '@ui/Row';
import { Input } from '@ui/Input';
import { Button } from '@ui/Button';
import { StyledCard } from '@ui/StyledCard';
import { Heading } from '@components/common/Heading';
import HandRock from '@icons/HandRock.svg';

import { SuccessModal } from '@components/common/Modal';
import Link from 'next/link';
import s from './Form.module.sass';

const config = {
  angle: 90,
  spread: 360,
  startVelocity: 40,
  elementCount: '200',
  dragFriction: 0.12,
  duration: 3000,
  stagger: '3',
  width: '10px',
  height: '10px',
  perspective: '500px',
  colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
};

const findInput = (inputs: any, errors: any) => inputs.find((input: any) => {
  const name = input.name || input.id; // <------------ THERE
  return name && getIn(errors, name);
});

// @ts-ignore
const focusOnError = focusDecorator(null, findInput);

// Default stake value
type FormValues = {
  qpToken: string
  token: string
  lifeTimeDays: number
  lifeTimeHours: number
  lifeTimeMinutes: number
  lifeTimeSeconds: number
  rewardPeriod: number
  rewardPerBlock: number
  isStake: boolean
};

export const YieldForm: React.FC = () => {
  const { t, i18n } = useTranslation(['common', 'home']);
  const [isSuccessModal, setIsSuccessModal] = useState({
    opened: false,
    tokenAddress: '',
  });

  // Context
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const refDonutSecond = useRef(null);
  const refDonutThird = useRef(null);
  const refDonutFinal = useRef(null);

  const [isSecondActive, setIsSecondActive] = useState({
    second: false,
    third: false,
  });
  const [finalDonutActive, setFinalActiveDonut] = useState(false);

  const isScrolledIntoView = (elem: any) => {
    const bounding = elem.getBoundingClientRect();
    return (
      bounding.top - 150 <= 0
    );
  };
  const onScroll = () => {
    if (refDonutFinal.current) {
      console.log('isScrolledIntoView(refDonutFinal.current)', isScrolledIntoView(refDonutFinal.current));
      setFinalActiveDonut(isScrolledIntoView(refDonutFinal.current));
    }
    if (refDonutSecond.current && refDonutThird.current) {
      setIsSecondActive({
        second: isScrolledIntoView(refDonutSecond.current),
        third: isScrolledIntoView(refDonutThird.current),
      });
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', () => onScroll());
    return window.removeEventListener('scroll', () => onScroll());
  }, []);

  // Logic of form
  const { Form } = withTypes<FormValues>();

  const onSubmit = useCallback(async (
    values: FormValues,
    form: FormApi<FormValues>,
  ) => {
    const lifeTime = (+values.lifeTimeDays || 1) * 86400
      + (+values.lifeTimeHours || 0) * 3600
      + (+values.lifeTimeMinutes || 0) * 60
      + (+values.lifeTimeSeconds || 0);
    try {
      if (tezos) {
        await createFarming(
          tezos,
          values.qpToken,
          values.token,
          lifeTime,
          +values.rewardPeriod,
          +values.rewardPerBlock,
          values.isStake,
        );
        const storage = await getStorageInfo(tezos, CONSTRUCT_FARM_CONTRACT);
        const { yieldFarmings } = storage;
        const val = await yieldFarmings.get(accountPkh);

        //
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: accountPkh, token: val[val.length - 1] }),
        };
        fetch('https://sleepy-tor-46627.herokuapp.com/core/yfs/', requestOptions)
          .then((response) => console.log(response))
          .catch((err) => console.log(err));
        //

        setIsSuccessModal({
          opened: true,
          tokenAddress: val[val.length - 1],
        });

        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        setTimeout(form.restart);
      }
    } catch (e) {
      console.log(e);
    }
  }, [tezos]);

  // @ts-ignore
  return (
    <Container>
      <Form
        key={i18n.language}
        onSubmit={onSubmit}
        initialValues={{ lifeTimeDays: 10, isStake: true }}
        // @ts-ignore
        decorators={[focusOnError]}
        render={({
          handleSubmit, submitting, form, values,
        }) => (
          <form onSubmit={handleSubmit}>
            <Row className={s.row}>
              <div className={s.form}>
                <div className={s.block}>
                  <Heading
                    header={t('home:Set up\nQP token')}
                    subheader="01*"
                  />
                  <Field
                    name="qpToken"
                    validate={composeValidators(
                      required,
                    )}
                  >
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        className={s.input}
                        label={`${t('home:QP token address')}:`}
                        placeholder={t('home:Enter QP Token Address e.g. tz1W3a2...pSBmH')}
                        error={(meta.touched && meta.error) || meta.submitError}
                        success={!meta.error && meta.touched && !meta.submitError}
                      />
                    )}
                  </Field>
                </div>
                <div className={s.block} ref={refDonutSecond}>
                  <Heading
                    header={t('home:Set mining\nparameters')}
                    subheader="02*"
                  />
                  <div className={s.innerBlock}>
                    <Field name="token" validate={composeValidators(required)}>
                      {({ input, meta }) => (
                        <Input
                          {...input}
                          className={s.input}
                          label={`${t('home:Token Address')}:`}
                          placeholder={t('home:Enter reward Token Address e.g. tz1W3...SBmH')}
                          error={(meta.touched && meta.error) || meta.submitError}
                          success={!meta.error && meta.touched && !meta.submitError}
                        />
                      )}
                    </Field>
                  </div>
                  <div className={s.innerBlock}>
                    <div className={s.timeLabel}>
                      {t('home:Lifetime')}
                      :
                    </div>
                    <div className={s.timeWrapper}>
                      <Field name="lifeTimeDays" validate={composeValidators(required, validateDay)}>
                        {({ input, meta }) => (
                          <Input
                            {...input}
                            type="number"
                            className={s.inputTime}
                            labelClassName={s.inputTimeLabel}
                            inputClassName={s.inputTimeInput}
                            label={`${t('home:Days')}:`}
                            placeholder="69"
                            step={1}
                            min={1}
                            max={100}
                            error={(meta.touched && meta.error) || meta.submitError}
                            success={!meta.error && !meta.submitError}
                          />
                        )}
                      </Field>

                      <Field name="lifeTimeHours" validate={composeValidators(validateHours)}>
                        {({ input, meta }) => (
                          <Input
                            {...input}
                            type="number"
                            className={s.inputTime}
                            labelClassName={s.inputTimeLabel}
                            inputClassName={s.inputTimeInput}
                            label={`${t('home:Hours')}:`}
                            placeholder="23"
                            step={1}
                            min={0}
                            max={23}
                            error={(meta.touched && meta.error) || meta.submitError}
                            success={!meta.error && meta.touched && !meta.submitError}
                          />
                        )}
                      </Field>

                      <Field name="lifeTimeMinutes" validate={composeValidators(validateMinsSecs)}>
                        {({ input, meta }) => (
                          <Input
                            {...input}
                            type="number"
                            className={s.inputTime}
                            labelClassName={s.inputTimeLabel}
                            inputClassName={s.inputTimeInput}
                            label={`${t('home:Minutes')}:`}
                            placeholder="00"
                            step={1}
                            min={0}
                            max={59}
                            error={(meta.touched && meta.error) || meta.submitError}
                            success={!meta.error && meta.touched && !meta.submitError}
                          />
                        )}
                      </Field>

                      <Field name="lifeTimeSeconds" validate={composeValidators(validateMinsSecs)}>
                        {({ input, meta }) => (
                          <Input
                            {...input}
                            type="number"
                            className={s.inputTime}
                            labelClassName={s.inputTimeLabel}
                            inputClassName={s.inputTimeInput}
                            label={`${t('home:Seconds')}:`}
                            placeholder="00"
                            step={1}
                            min={0}
                            max={59}
                            error={(meta.touched && meta.error) || meta.submitError}
                            success={!meta.error && meta.touched && !meta.submitError}
                          />
                        )}
                      </Field>
                    </div>
                    <p className={s.item}>
                      {t('home:Estimated starting & closing time')}
                      :
                      {' '}
                      <br />
                      <strong>
                        {
                          (+values.lifeTimeDays || 1) * 86400
                          + (+values.lifeTimeHours || 0) * 3600
                          + (+values.lifeTimeMinutes || 0) * 60
                          + (+values.lifeTimeSeconds || 0)
                            ? (`${dayjs().format('YYYY-MM-DD HH:mm')} — ${dayjs(dayjs().add(
                              ((+values.lifeTimeDays || 1) * 86400
                            + (+values.lifeTimeHours || 0) * 3600
                            + (+values.lifeTimeMinutes || 0) * 60
                            + (+values.lifeTimeSeconds || 0)) * 1000,
                            )).format('YYYY-MM-DD HH:mm')}`)
                            : 'XXXXXXX'
                        }
                      </strong>
                    </p>
                  </div>
                  <div className={s.innerBlock}>
                    <Field
                      name="rewardPeriod"
                      validate={composeValidators(
                        required,
                        validateSecs(
                          (+values.lifeTimeDays || 1) * 86400
                          + (+values.lifeTimeHours || 0) * 3600
                          + (+values.lifeTimeMinutes || 0) * 60
                          + (+values.lifeTimeSeconds || 0),
                        ),
                      )}
                    >
                      {({ input, meta }) => (
                        <Input
                          {...input}
                          type="number"
                          className={s.input}
                          label={`${t('home:Reward Period in Seconds')}:`}
                          placeholder="932157"
                          step={1}
                          min={1}
                          max={
                            (+values.lifeTimeDays || 1) * 86400
                            + (+values.lifeTimeHours || 0) * 3600
                            + (+values.lifeTimeMinutes || 0) * 60
                            + (+values.lifeTimeSeconds || 0)
                          }
                          error={(meta.touched && meta.error) || meta.submitError}
                          success={!meta.error && meta.touched && !meta.submitError}
                        />
                      )}
                    </Field>
                    <Field
                      name="rewardPerBlock"
                      validate={composeValidators(
                        required,
                      )}
                    >
                      {({ input, meta }) => (
                        <Input
                          {...input}
                          type="number"
                          className={s.input}
                          label={`${t('home:Mining Reward per Block')}:`}
                          placeholder={t('home:Mining reward for each block')}
                          error={(meta.touched && meta.error) || meta.submitError}
                          success={!meta.error && meta.touched && !meta.submitError}
                        />
                      )}
                    </Field>
                    <p className={s.item}>
                      {t('home:Total Working Blocks Amount')}
                      :
                      {' '}
                      <strong>
                        {
                          values.lifeTimeDays && values.rewardPeriod && Math.floor(
                            ((+values.lifeTimeDays || 1) * 86400
                              + (+values.lifeTimeHours || 0) * 3600
                              + (+values.lifeTimeMinutes || 0) * 60
                              + (+values.lifeTimeSeconds || 0)) / +values.rewardPeriod,
                          ) > 0
                            ? Math.floor(((+values.lifeTimeDays || 1) * 86400
                            + (+values.lifeTimeHours || 0) * 3600
                            + (+values.lifeTimeMinutes || 0) * 60
                            + (+values.lifeTimeSeconds || 0)) / +values.rewardPeriod)
                            : 'XXXXXXX'
                        }
                      </strong>
                    </p>
                    <p className={s.item}>
                      Total Reward:
                      {' '}
                      <strong>
                        {
                          values.lifeTimeDays && values.rewardPeriod && values.rewardPerBlock
                          && Math.floor(
                            ((+values.lifeTimeDays || 1) * 86400
                              + (+values.lifeTimeHours || 0) * 3600
                              + (+values.lifeTimeMinutes || 0) * 60
                              + (+values.lifeTimeSeconds || 0)) / +values.rewardPeriod,
                          ) > 0
                            ? Math.floor(((+values.lifeTimeDays || 1) * 86400
                            + (+values.lifeTimeHours || 0) * 3600
                            + (+values.lifeTimeMinutes || 0) * 60
                            + (+values.lifeTimeSeconds || 0)) / +values.rewardPeriod)
                            * values.rewardPerBlock
                            : 'XXXXXXX'
                        }
                      </strong>
                    </p>
                    <p className={cx(s.item, s.active)}>
                      Available balance:
                      {' '}
                      <strong>0 DTZ</strong>
                    </p>
                  </div>
                </div>
                <div className={s.block} ref={refDonutThird}>
                  <Heading
                    header={t('home:Project\ninformation')}
                    subheader={(
                      <>
                        03
                        <span className={s.optional}>(Optional)</span>
                      </>
                  )}
                  />
                  <Input
                    className={s.input}
                    label="Official Website:"
                    placeholder="Website Address e.g. https://www.a...x.com/"
                  />
                  <Input
                    className={s.input}
                    label="Project Introduction:"
                    placeholder="Your Project Description
e.g. This project is about yeild farming..."
                    textarea
                  />
                </div>
              </div>
              <div className={s.donut}>
                <img
                  className={cx(s.donutImage, s.donutImageFirst)}
                  src="/images/donut/DonutFirst.png"
                  alt="DONUTEZ base"
                />
                <img
                  className={cx(
                    s.donutImage,
                    s.donutImageSecond, { [s.active]: isSecondActive.second },
                  )}
                  src="/images/donut/DonutSecond.png"
                  alt="DONUTEZ base"
                />
                <img
                  className={cx(
                    s.donutImage,
                    s.donutImageThird, { [s.active]: isSecondActive.third },
                  )}
                  src="/images/donut/DonutThird.png"
                  alt="DONUTEZ base"
                />
              </div>
            </Row>
            <div className={s.donutFinalWrapper} ref={refDonutFinal}>

              <Confetti
                className={s.confetti}
                active={finalDonutActive}
                // @ts-ignore
                config={config}
              />
              <img
                className={cx(s.donutFinal, { [s.finalActive]: finalDonutActive })}
                src="/images/donut/DonutInBox.png"
                alt="DONUTEZ base"
              />
            </div>
            <Row className={s.final}>
              <Heading header={t('home:Create it!')} subheader={t('home:Finally')} />
              <p className={s.description}>
                Get
                {' '}
                <strong>30%</strong>
                {' '}
                Discount for staking 60 DTZ
                <br />
                {' '}
                and get them back as reward in
                {' '}
                <strong>~2 weeks</strong>
                {' '}
                to create new contracts
              </p>
              <div className={s.cards}>
                <StyledCard className={s.card} theme="green">
                  <h3 className={cx(s.header, s.headerCTA)}>
                    {CONSTRUCT_STAKE_FEE}
                    {' '}
                    DTZ
                  </h3>
                  <p className={s.subheader}>
                    +
                    {CONSTRUCT_STAKE_SUM}
                    {' '}
                    DTZ
                    {' '}
                    {t('home:to stake')}
                  </p>
                  <h4 className={s.listHeader}>
                    {t('home:You will get')}
                    :
                  </h4>
                  <ul className={s.list}>
                    <li>
                      {t('home:Smart contract')}
                    </li>
                    <li>
                      {t('home:Discount 30%')}
                    </li>
                    <li>
                      {t('home:Own front-end')}
                    </li>
                    <li>
                      {t('home:Staked DTZ which u’ll get back in 2 weeks as reward')}
                    </li>
                  </ul>
                  <Button
                    className={s.button}
                    type="submit"
                    onClick={() => {
                      form.change('isStake', true);
                    }}
                  >
                    {submitting ? t('common:Loading...') : t('home:Create & Stake')}
                  </Button>
                </StyledCard>
                <StyledCard className={s.card} theme="orange">
                  <h3 className={s.header}>
                    {CONSTRUCT_FEE}
                    {' '}
                    DTZ
                  </h3>
                  <p className={cx(s.subheader, s.subheaderEmpty)}>0 DTZ</p>
                  <h4 className={s.listHeader}>
                    {t('home:You will get')}
                    :
                  </h4>
                  <ul className={s.list}>
                    <li>
                      {t('home:Smart contract')}
                    </li>
                    <li>
                      {t('home:Own front-end')}
                    </li>
                  </ul>
                  <Button
                    type="submit"
                    className={s.button}
                    theme="secondary"
                    onClick={() => {
                      form.change('isStake', false);
                    }}
                  >
                    {submitting ? t('common:Loading...') : t('common:Create')}
                  </Button>
                </StyledCard>
              </div>
              <HandRock className={s.hand} />
            </Row>
          </form>
        )}
      />
      <SuccessModal
        isOpen={isSuccessModal.opened}
        onRequestClose={() => setIsSuccessModal({
          opened: false,
          tokenAddress: '',
        })}
      >
        <h2 className={s.modalHeader}>
          Your yield farming contract address:
        </h2>
        <strong className={s.modalAddress}>{isSuccessModal.tokenAddress}</strong>
        <h2 className={cx(s.modalHeader, s.modalHeader2)}>
          Your website:
        </h2>
        <strong className={s.modalAddressBottom}>
          <Link href={`/yield-farmings/${isSuccessModal.tokenAddress}`}>
            {`https://donutez-farm.vercel.app/yield-farmings/${isSuccessModal.tokenAddress}`}
          </Link>
        </strong>
      </SuccessModal>
    </Container>
  );
};
