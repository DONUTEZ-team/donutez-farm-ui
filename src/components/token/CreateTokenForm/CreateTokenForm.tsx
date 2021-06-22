import React, { ReactNode, useCallback, useState } from 'react';
import Image from 'next/image';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import {
  Field,
  withTypes,
} from 'react-final-form';
import { FormApi } from 'final-form';
import createDecorator from 'final-form-focus';

import {
  BCD,
  TEMPLATE_TOKEN_ICON,
} from '@utils/defaults';
import {
  useAccountPkh,
  useTezos,
} from '@utils/dapp';
import {
  parseNumber,
  parseTokenSymbol,
  parseTokenName,
  formatName,
  formatImageType, getTokenLogo,
} from '@utils/helpers';
import {
  composeValidators,
  required,
  validateMinMax,
} from '@utils/validators';
import { createToken } from '@utils/createToken';
import useIpfsFactory from '@utils/ipfs';
import { Container } from '@components/ui/Container';
import { Row } from '@components/ui/Row';
import { Button } from '@components/ui/Button';
import { Heading } from '@components/ui/Heading';
import { Input } from '@components/ui/Input';
import { MediaInput } from '@components/common/MediaInput';
import { NumberInput } from '@components/common/NumberInput';
import { TokensInfo } from '@components/common/TokensInfo';
import {
  ModalStatuses,
  StateModal,
} from '@components/common/StateModal';

import { ConnectWallet } from '@containers/common/ConnectWallet';
import { TokenCard } from './TokenCard';
import s from './CreateTokenForm.module.sass';

const focusOnErrors = createDecorator();

type SuccessModalMessageProps = {
  name: string
  symbol?: string
  icon: string
  address: string
};

const SuccessModalMessage: React.FC<SuccessModalMessageProps> = ({
  name,
  symbol,
  icon,
  address,
}) => {
  const { t } = useTranslation('token');

  return (
    <>
      <p>{t('token:Your token has been created successfully!')}</p>
      <TokensInfo
        firstToken={{
          name,
          symbol: symbol ?? name.replace(' ', '').substr(0, 3).toUpperCase(),
          icon: getTokenLogo(icon),
          address,
        }}
        className={s.tokenInfo}
      />
      <p>
        {t('token:Token address is')}
        {' '}
        <a
          href={`${BCD}${address}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          {address}
        </a>
      </p>
    </>
  );
};

// Default form values
type FormValues = {
  name: string
  symbol: string
  icon: any
  totalSupply: number
  decimals: number
};

type CreateTokenFormProps = {
  className?: string
};

export const CreateTokenForm: React.FC<CreateTokenFormProps> = ({
  className,
}) => {
  const { t, i18n } = useTranslation(['common', 'token']);

  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const [modalState, setModalState] = useState<{
    status: ModalStatuses,
    message: string | ReactNode | null
  }>({
    status: ModalStatuses.Default,
    message: null,
  });

  // Logic of form
  const { Form } = withTypes<FormValues>();
  const { ipfs } = useIpfsFactory();

  const onSubmit = useCallback(async (
    values: FormValues,
    form: FormApi<FormValues>,
  ) => {
    try {
      if (tezos) {
        let ipfsFileUrl = TEMPLATE_TOKEN_ICON;
        if (values.icon) {
          setModalState({
            status: ModalStatuses.Pending,
            message: t('token:Loading asset to IPFS...'),
          });
          const fileName = formatName(`${values.name} ${values.symbol}${formatImageType(values.icon.type)}`);
          const ipfsFile = await ipfs.add({
            path: fileName,
            content: values.icon,
          },
          {
            wrapWithDirectory: true,
          });
          ipfsFileUrl = `ipfs://${ipfsFile.cid.string}/${fileName}`;
        }

        setModalState({
          status: ModalStatuses.Pending,
          message: t('token:Creating token...'),
        });
        await createToken(
          tezos,
          values.name,
          values.symbol ?? values.name.replace(' ', '').substr(0, 3).toUpperCase(),
          ipfsFileUrl,
          values.totalSupply,
          values.decimals,
        );
        setModalState({
          status: ModalStatuses.Success,
          message: (
            <SuccessModalMessage
              name={values.name}
              symbol={values.symbol}
              icon={ipfsFileUrl}
              // TODO: Change address
              address="KT1CBerr3qiQ8caoKHVDZNH4Dcb4iRAHoh9r"
            />
          ),
        });
        setTimeout(form.restart);
      }
    } catch (e) {
      setModalState({
        status: ModalStatuses.Error,
        message: e.message,
      });
    }
  }, [tezos, t, ipfs]);

  return (
    <section className={cx(s.root, className)}>
      <Container>
        <Row className={s.row}>
          <Heading
            header={t('token:Token\nInformation')}
            subheader="01"
            className={s.heading}
          />
        </Row>
      </Container>
      <Form
        key={i18n.language}
        onSubmit={onSubmit}
        initialValues={{ decimals: 6 }}
        // @ts-ignore
        decorators={[focusOnErrors]}
        mutators={{
          setValue: ([field, value], state, { changeValue }) => {
            changeValue(state, field, () => value);
          },
        }}
        render={({
          handleSubmit, form, submitting, values,
        }) => (
          <div className={s.section}>
            <Container>
              <form onSubmit={handleSubmit}>
                <Row className={s.row}>
                  <div className={s.form}>
                    <div className={s.block}>
                      <Field
                        name="name"
                        validate={required}
                        parse={parseTokenName}
                      >
                        {({ input, meta }) => (
                          <Input
                            {...input}
                            className={s.input}
                            label={`${t('token:Token name')}:`}
                            placeholder="DONUTEZ"
                            error={(meta.touched && meta.error) || meta.submitError}
                            success={!meta.error && meta.touched && !meta.submitError}
                          />
                        )}
                      </Field>
                      <Field
                        name="symbol"
                        parse={parseTokenSymbol}
                      >
                        {({ input, meta }) => (
                          <Input
                            {...input}
                            className={s.input}
                            label={`${t('token:Token symbol')}:`}
                            placeholder="DTZ"
                            error={(meta.touched && meta.error) || meta.submitError}
                            success={!meta.error && meta.touched && !meta.submitError}
                          />
                        )}
                      </Field>
                      <Field
                        name="decimals"
                        validate={composeValidators(required, validateMinMax(0, 18))}
                        parse={(value) => parseNumber(value, 0, 18)}
                      >
                        {({ input, meta }) => (
                          <NumberInput
                            {...input}
                            theme="large"
                            className={s.input}
                            label={`${t('token:Decimals')}:`}
                            placeholder="6"
                            step={1}
                            min={0}
                            max={18}
                            error={(meta.touched && meta.error) || meta.submitError}
                            success={!meta.error && meta.touched && !meta.submitError}
                            onIncrementClick={() => {
                              form.mutators.setValue(
                                'decimals',
                                +input.value + 1 > 18 ? 18 : +input.value + 1,
                              );
                            }}
                            onDecrementClick={() => {
                              form.mutators.setValue(
                                'decimals',
                                +input.value - 1 < 0 ? 0 : +input.value - 1,
                              );
                            }}
                          />
                        )}
                      </Field>
                      <Field<File | string>
                        name="icon"
                      >
                        {({ input: { value, onChange, ...input }, meta }) => (
                          <MediaInput
                            {...input}
                            className={s.input}
                            label={`${t('token:Token icon')}:`}
                            value={value}
                            onChange={(file) => onChange(file)}
                            error={(meta.touched && meta.error) || meta.submitError}
                            success={!meta.error && meta.touched && !meta.submitError}
                          />
                        )}
                      </Field>
                      <Field
                        name="totalSupply"
                        validate={composeValidators(required, validateMinMax(1, 1_000_000_000))}
                        parse={(value) => parseNumber(value, 1, 1_000_000_000)}
                      >
                        {({ input, meta }) => (
                          <NumberInput
                            {...input}
                            theme="large"
                            className={s.input}
                            label={`${t('token:Total supply')}:`}
                            placeholder="1000000"
                            step={1}
                            min={1}
                            max={1_000_000_000}
                            error={(meta.touched && meta.error) || meta.submitError}
                            success={!meta.error && meta.touched && !meta.submitError}
                            onIncrementClick={() => {
                              form.mutators.setValue(
                                'totalSupply',
                                +input.value + 1 > 1_000_000_000 ? 1_000_000_000 : +input.value + 1,
                              );
                            }}
                            onDecrementClick={() => {
                              form.mutators.setValue(
                                'totalSupply',
                                +input.value - 1 < 1 ? 1 : +input.value - 1,
                              );
                            }}
                          />
                        )}
                      </Field>
                      {
                        !accountPkh
                          ? (
                            <ConnectWallet className={s.button} label="Connect wallet" />
                          )
                          : (
                            <Button type="submit" className={s.button} disabled={submitting}>
                              {submitting ? t('common:Loading...') : t('token:Create & Deploy')}
                            </Button>
                          )
                      }
                    </div>
                    <TokenCard
                      className={s.card}
                      icon={values.icon}
                      name={values.name}
                      symbol={values.symbol}
                      decimals={values.decimals}
                      totalSupply={values.totalSupply}
                    />
                  </div>
                </Row>
              </form>
            </Container>

            <div className={s.handsWrapper}>
              <div className={cx(s.hands, {
                [s.active]: !(values.icon
                  && values.name
                  && values.symbol
                  && values.decimals
                  && values.totalSupply),
              })}
              >
                <Image
                  layout="responsive"
                  quality={90}
                  width={405}
                  height={553}
                  priority
                  src="/images/HandTwoFingers.png"
                  alt="DONUTEZ Farm"
                />
              </div>
              <div className={cx(s.hands, {
                [s.active]: !!(values.icon
                  && values.name
                  && values.symbol
                  && values.decimals
                  && values.totalSupply),
              })}
              >
                <Image
                  layout="responsive"
                  quality={90}
                  width={405}
                  height={553}
                  priority
                  src="/images/HandOneFinger.png"
                  alt="DONUTEZ Farm"
                />
              </div>
            </div>
          </div>
        )}
      />

      <div className={s.backgroundWrapper}>
        <Container>
          <Row className={s.row}>
            <img
              className={cx(s.background)}
              src="/images/TokenBackground3.svg"
              alt="DONUTEZ Farm"
            />
          </Row>
        </Container>
      </div>
      <StateModal
        isOpen={modalState.status !== ModalStatuses.Default}
        onRequestClose={
          () => (
            modalState.status === ModalStatuses.Error
            || modalState.status === ModalStatuses.Success
          ) && setModalState({
            status: ModalStatuses.Default,
            message: null,
          })
        }
        status={modalState.status}
        message={modalState.message}
      />
    </section>
  );
};
