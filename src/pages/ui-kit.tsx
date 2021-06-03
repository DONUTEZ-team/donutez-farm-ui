import React, { useCallback, useState } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextSeo } from 'next-seo';

import { BaseLayout } from '@layouts/BaseLayout';
import { Row } from '@components/ui/Row';
import { Container } from '@components/ui/Container';
import { Heading } from '@components/ui/Heading';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { NumberInput } from '@components/common/NumberInput';
import { MediaInput } from '@components/ui/MediaInput';
import { StyledCard } from '@components/ui/StyledCard';
import { Modal } from '@components/ui/Modal';

import s from '../styles/UiKit.module.sass';

const UiKit: React.FC = () => {
  const { t } = useTranslation(['common', 'ui-kit']);

  const [modalOpened, setModalOpened] = useState(false);
  const openModal = useCallback(() => setModalOpened(true), []);
  const closeModal = useCallback(() => setModalOpened(false), []);

  return (
    <BaseLayout>
      <NextSeo
        title={t('ui-kit:UI Kit page')}
        description={t('ui-kit:UI Kit page description. Couple sentences...')}
        openGraph={{
          title: t('ui-kit:UI Kit page'),
          description: t('ui-kit:UI Kit page description. Couple sentences...'),
        }}
      />
      <Container>
        <Row className={s.row}>
          <div className={s.block}>
            <h1 className={s.header}>[DEV] UI Kit</h1>
          </div>
          <div className={s.block}>
            <Heading header="Colors" subheader="01" />
            <div className={s.colors}>
              <div className={s.colorsColumn}>
                <p className={s.colorsHeader}>Accent</p>
                <div className={cx(s.color, s.accent, s.accent100)}>100</div>
                <div className={cx(s.color, s.accent, s.accent80)}>80</div>
                <div className={cx(s.color, s.accent, s.accent120)}>120</div>
                <div className={cx(s.color, s.accent, s.accent160)}>160</div>
                <div className={cx(s.color, s.accent, s.accent60)}>60</div>
                <div className={cx(s.color, s.accent, s.accent20)}>20</div>
              </div>
              <div className={s.colorsColumn}>
                <p className={s.colorsHeader}>Secondary</p>
                <div className={cx(s.color, s.secondary, s.secondary100)}>100</div>
              </div>
              <div className={s.colorsColumn}>
                <p className={s.colorsHeader}>Light</p>
                <div className={cx(s.color, s.light, s.light100)}>100</div>
                <div className={cx(s.color, s.light, s.light120)}>120</div>
                <div className={cx(s.color, s.light, s.light140)}>140</div>
                <div className={cx(s.color, s.light, s.light160)}>160</div>
                <div className={cx(s.color, s.light, s.light60)}>60</div>
              </div>
              <div className={s.colorsColumn}>
                <p className={s.colorsHeader}>Dark</p>
                <div className={cx(s.color, s.dark, s.dark100)}>100</div>
                <div className={cx(s.color, s.dark, s.dark60)}>60</div>
              </div>
              <div className={s.colorsColumn}>
                <p className={s.colorsHeader}>Service</p>
                <div className={cx(s.color, s.service, s.success100)}>100</div>
                <div className={cx(s.color, s.service, s.success80)}>80</div>
                <div className={cx(s.color, s.service, s.cardGreenFill)} />
                <div className={cx(s.color, s.service, s.cardGreenBorder)} />
                <div className={cx(s.color, s.service, s.cardOrangeFill)} />
                <div className={cx(s.color, s.service, s.cardOrangeBorder)} />
                <div className={cx(s.color, s.service, s.cardBlueFill)} />
                <div className={cx(s.color, s.service, s.cardBlueBorder)} />
              </div>
            </div>
          </div>
          <div className={s.block}>
            <Heading header="Fonts" subheader="02" />
            <div className={cx(s.font, s.fontH1)}>
              h1 - DONUT QUEST 70/80px
            </div>
            <div className={cx(s.font, s.fontH2)}>
              h2 - DONUT QUEST 62/64px
            </div>
            <div className={cx(s.font, s.fontDesign)}>
              Design - DONUT QUEST 110px
            </div>
            <div className={cx(s.font, s.fontLabels)}>
              Labels -  HK Grotesk SemiBold, 18px
            </div>
            <div className={cx(s.font, s.fontBold)}>
              Bold -  HK Grotesk Black, 16px
            </div>
            <div className={cx(s.font, s.fontGeneral)}>
              General -  HK Grotesk Regular, 16px
            </div>
          </div>
          <div className={s.block}>
            <Heading header="Headings" subheader="03" />
            <Heading header="Required" subheader="01" />
            <Heading header="Optional header" subheader="02" isRequired={false} />
            <Heading header="Create it!" subheader="Finally" isRequired={null} />
          </div>
          <div className={s.block}>
            <Heading header="Buttons" subheader="04" />
            <div className={s.buttons}>
              <div className={s.buttonsRow}>
                <Button className={s.button}>
                  Primary
                </Button>
                <Button
                  disabled
                  className={s.button}
                >
                  Primary
                </Button>
              </div>
              <div className={s.buttonsRow}>
                <Button
                  theme="secondary"
                  className={s.button}
                >
                  Secondary
                </Button>
                <Button
                  theme="secondary"
                  disabled
                  className={s.button}
                >
                  Secondary
                </Button>
              </div>
            </div>
            <div className={cx(s.buttons, s.buttonsLight)}>
              <div className={s.buttonsRow}>
                <Button
                  theme="light"
                  className={s.button}
                >
                  Light
                </Button>
                <Button
                  theme="light"
                  disabled
                  className={s.button}
                >
                  Light
                </Button>
              </div>
              <div className={s.buttonsRow}>
                <Button
                  theme="lightSecondary"
                  className={s.button}
                >
                  Light Secondary
                </Button>
                <Button
                  theme="lightSecondary"
                  disabled
                  className={s.button}
                >
                  Light Secondary
                </Button>
              </div>
            </div>
          </div>
          <div className={s.block}>
            <Heading header="Tags" subheader="05" />
            <div className={s.tags}>
              -- We&apos;ll add it later --
            </div>
          </div>
          <div className={s.block}>
            <Heading header="Inputs" subheader="06" />
            <Input
              className={s.input}
              label="Mining Reward per Block"
              placeholder="Mining reward for each block"
            />
            <Input
              className={s.input}
              label="Mining Reward per Block (Success)"
              placeholder="Mining reward for each block"
              success
            />
            <Input
              className={s.input}
              label="Mining Reward per Block (Error)"
              placeholder="Mining reward for each block"
              error="Enter valid amount"
            />
            <Input
              className={s.input}
              label="Mining Reward per Block (Disabled)"
              placeholder="Mining reward for each block"
              disabled
            />
          </div>
          <div className={s.block}>
            <Heading header="Number Inputs" subheader="07" />
            <NumberInput
              className={s.input}
              label="Days"
              placeholder="69"
              step={1}
              min={1}
              max={100}
            />
            <NumberInput
              className={s.input}
              label="Days"
              placeholder="69"
              step={1}
              min={1}
              max={100}
              success
            />
            <NumberInput
              className={s.input}
              label="Days"
              placeholder="69"
              step={1}
              min={1}
              max={100}
              error="Too large"
            />
            <NumberInput
              className={s.input}
              label="Days"
              placeholder="69"
              step={1}
              min={1}
              max={100}
              disabled
            />
          </div>
          <div className={s.block}>
            <Heading header="Textareas" subheader="08" />
            <Input
              className={s.input}
              label="Mining Reward per Block"
              placeholder="Mining reward for each block"
              textarea
            />
            <Input
              className={s.input}
              label="Mining Reward per Block (Success)"
              placeholder="Mining reward for each block"
              textarea
              success
            />
            <Input
              className={s.input}
              label="Mining Reward per Block (Error)"
              placeholder="Mining reward for each block"
              textarea
              error="Enter valid amount"
            />
            <Input
              className={s.input}
              label="Mining Reward per Block (Disabled)"
              placeholder="Mining reward for each block"
              textarea
              disabled
            />
          </div>
          <div className={s.block}>
            <Heading header="Media Inputs" subheader="09" />
            <MediaInput
              className={s.input}
              label="OG Image:"
              onChange={() => {}}
            />
            <MediaInput
              className={s.input}
              label="OG Image:"
              onChange={() => {}}
              success
            />
            <MediaInput
              className={s.input}
              label="OG Image:"
              onChange={() => {}}
              error="File has to be less than 30 MB."
            />
            <MediaInput
              className={s.input}
              label="OG Image:"
              onChange={() => {}}
              disabled
            />
          </div>
          <div className={s.block}>
            <Heading header="Cards" subheader="10" />
            <div className={s.cards}>
              <StyledCard className={s.card} />
              <StyledCard className={s.card} theme="green" />
              <StyledCard className={s.card} theme="orange" />
            </div>
          </div>
          <div className={s.block}>
            <Heading header="Modal" subheader="11" />
            <Button onClick={openModal}>Open Modal</Button>
          </div>
        </Row>
      </Container>
      <Modal isOpen={modalOpened} onRequestClose={closeModal} />
    </BaseLayout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'home']),
  },
});

export default UiKit;
