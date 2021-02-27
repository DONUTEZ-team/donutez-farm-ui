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
// eslint-disable-next-line import/no-named-default
import focusDecorator from 'final-form-focus';
import {
  composeValidators,
  required,
  validateDay,
  validateHours,
  validateMinsSecs,
  validateSecs,
} from '@utils/validators';
import { useTezos } from '@utils/dapp';
import { createFarming } from '@utils/createFarming';
import { CONSTRUCT_FEE, CONSTRUCT_STAKE_FEE, CONSTRUCT_STAKE_SUM } from '@utils/defaults';

import { Container } from '@ui/Container';
import { Row } from '@ui/Row';
import { Input } from '@ui/Input';
import { Button } from '@ui/Button';
import { StyledCard } from '@ui/StyledCard';
import { Heading } from '@components/common/Heading';
import HandRock from '@icons/HandRock.svg';

import s from './Form.module.sass';

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

  // Context
  const tezos = useTezos();

  const refDonutSecond = useRef(null);
  const refDonutThird = useRef(null);

  const [isSecondActive, setIsSecondActive] = useState({
    second: false,
    third: false,
  });

  const isScrolledIntoView = (elem: any) => {
    const bounding = elem.getBoundingClientRect();
    return (
      bounding.top - 150 <= 0
    );
  };
  const onScroll = () => {
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

        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        setTimeout(form.restart);
      }
    } catch (e) {
      console.log(e);
    }
  }, [tezos]);

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
                        label="QP token address:"
                        placeholder="Enter QP Token Address e.g. tz1W3a2...pSBmH"
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
                          label="Token Address:"
                          placeholder="Enter reward Token Address e.g. tz1W3...SBmH"
                          error={(meta.touched && meta.error) || meta.submitError}
                          success={!meta.error && meta.touched && !meta.submitError}
                        />
                      )}
                    </Field>
                  </div>
                  <div className={s.innerBlock}>
                    <div className={s.timeLabel}>Lifetime:</div>
                    <div className={s.timeWrapper}>
                      <Field name="lifeTimeDays" validate={composeValidators(required, validateDay)}>
                        {({ input, meta }) => (
                          <Input
                            {...input}
                            type="number"
                            className={s.inputTime}
                            labelClassName={s.inputTimeLabel}
                            inputClassName={s.inputTimeInput}
                            label="Days:"
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
                            label="Hours:"
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
                            label="Minutes:"
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
                            label="Seconds:"
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
                      Estimated starting & closing time:
                      {' '}
                      <strong>XXXXXXX</strong>
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
                          label="Reward Period in Seconds:"
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
                          label="Mining Reward per Block:"
                          placeholder="Mining reward for each block"
                          error={(meta.touched && meta.error) || meta.submitError}
                          success={!meta.error && meta.touched && !meta.submitError}
                        />
                      )}
                    </Field>
                    <p className={s.item}>
                      Total Working Blocks Amount:
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
            <Row className={s.final}>
              <Heading header="Create it!" subheader="Finally" />
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
                    {submitting ? 'Loading...' : t('home:Create & Stake')}
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
                    {submitting ? 'Loading...' : t('home:Create')}
                  </Button>
                </StyledCard>
              </div>
              <HandRock className={s.hand} />
            </Row>
          </form>
        )}
      />
    </Container>
  );
};
