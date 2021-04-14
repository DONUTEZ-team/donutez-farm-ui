import React, { useCallback, useRef } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

import { Container } from '@components/ui/Container';
import { Row } from '@components/ui/Row';
import { Button } from '@components/ui/Button';

import s from './FirstScreen.module.sass';

type FirstScreenProps = {
  title: string
  description: string
  image: string
};

export const FirstScreen: React.FC<FirstScreenProps> = ({
  title,
  description,
  image,
}) => {
  const { t } = useTranslation(['common']);

  const firstScreenRef = useRef<HTMLElement | null>(null);

  const handleScroll = useCallback(() => {
    if (!firstScreenRef.current) return;

    const offsetTop = firstScreenRef.current.offsetHeight;
    window.scroll({
      top: offsetTop,
      behavior: 'smooth',
    });
  }, []);

  return (
    <section className={s.root} ref={firstScreenRef}>
      <Container className={s.container}>
        <Row className={s.row}>
          <img
            className={s.background1}
            src="/images/HomeBackground1.svg"
            alt="DONUTEZ Farm"
          />
          <img
            className={s.background2}
            src="/images/HomeBackground2.svg"
            alt="DONUTEZ Farm"
          />
          <h1 className={s.header}>
            {title}
          </h1>
          <p className={s.description}>
            {description}
          </p>
          <div className={s.buttonWrapper}>
            <Button className={s.button} onClick={handleScroll}>
              {t('common:Create')}
            </Button>
            <div className={s.hand}>
              <Image
                layout="responsive"
                quality={90}
                width={230}
                height={160}
                src="/images/HandRight.png"
                alt="DONUTEZ Farm"
              />
            </div>
          </div>
          <div className={s.image}>
            <Image
              layout="responsive"
              quality={90}
              width={325}
              height={628}
              src={image}
              alt={title}
            />
          </div>
        </Row>
      </Container>
    </section>
  );
};
