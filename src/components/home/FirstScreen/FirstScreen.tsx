import React, {
  ReactNode,
  useCallback,
  useRef,
} from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import cx from 'classnames';

import handRight from '@images/HandRight.png';
import { Container } from '@components/ui/Container';
import { Row } from '@components/ui/Row';
import { Button } from '@components/ui/Button';

import s from './FirstScreen.module.sass';

type FirstScreenProps = {
  title: string | ReactNode
  alt?: string
  description: string
  image: StaticImageData
  isHome?: boolean
};

export const FirstScreen: React.FC<FirstScreenProps> = ({
  title,
  alt,
  description,
  image,
  isHome = false,
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

  const imageAlt = typeof title === 'string' ? title.replace(/\n/g, ' ') : alt;

  return (
    <section className={s.root} ref={firstScreenRef}>
      <div className={cx(s.backgrounds, { [s.home]: isHome })}>
        <Container>
          <Row className={s.row}>
            {isHome ? (
              <>
                <img
                  className={cx(s.background1, s.home)}
                  src="/images/HomeBackground1.svg"
                  alt="DONUTEZ Farm"
                />
                <img
                  className={cx(s.background2, s.home)}
                  src="/images/HomeBackground2.svg"
                  alt="DONUTEZ Farm"
                />
              </>
            ) : (
              <>
                <img
                  className={s.background1}
                  src="/images/TokenBackground1.svg"
                  alt="DONUTEZ Farm"
                />
                <img
                  className={s.background2}
                  src="/images/TokenBackground2.svg"
                  alt="DONUTEZ Farm"
                />
              </>
            )}
          </Row>
        </Container>
      </div>
      <Container>
        <Row className={s.row}>
          <h1 className={s.header}>
            {title}
          </h1>
          <p className={s.description}>
            {description}
          </p>
          {isHome ? (
            <div className={s.buttonWrapper}>
              <Button className={s.button} onClick={handleScroll}>
                {t('common:Create')}
              </Button>
              <div className={s.hand}>
                <Image
                  quality={90}
                  priority
                  src={handRight}
                  alt="DONUTEZ Farm"
                />
              </div>
            </div>
          ) : (
            <Button className={s.button} onClick={handleScroll}>
              {t('common:Create')}
            </Button>
          )}
          <div className={s.image}>
            <Image
              quality={90}
              priority
              src={image}
              alt={imageAlt}
            />
          </div>
        </Row>
      </Container>
    </section>
  );
};
