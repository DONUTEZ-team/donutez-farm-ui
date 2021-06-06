import React, {
  forwardRef, useCallback,
  useEffect,
  useRef,
} from 'react';
import cx from 'classnames';
import Image from 'next/image';
import ReactCanvasConfetti from 'react-canvas-confetti';

import s from './FinalDonut.module.sass';

const canvasStyles = {
  position: 'absolute',
  pointerEvents: 'none',
  width: '100%',
  top: 100,
  height: '100%',
  left: 0,
  zIndex: 2,
};

type FinalDonutProps = {
  isAnimated: boolean
  className?: string
};

export const FinalDonut = forwardRef<HTMLDivElement, FinalDonutProps>(({
  isAnimated,
  className,
}, ref) => {
  const animationInstance = useRef(null);

  const makeShot = (particleRatio: any, opts: any) => {
    if (animationInstance.current) {
      // @ts-ignore
      animationInstance.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio),
      });
    }
  };

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    makeShot(0.2, {
      spread: 60,
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, []);

  const handleFire = useCallback(() => {
    fire();
  }, [fire]);

  const getInstance = (instance: any) => {
    animationInstance.current = instance;
  };

  useEffect(() => {
    if (isAnimated) {
      const timer1 = setTimeout(handleFire, 400);
      return () => clearTimeout(timer1);
    }
    return () => {};
  }, [handleFire, isAnimated]);

  return (
    <div className={cx(s.root, className)} ref={ref}>
      <ReactCanvasConfetti
        refConfetti={getInstance}
        // @ts-ignore
        style={canvasStyles}
      />
      <div
        className={cx(
          s.image,
          { [s.active]: isAnimated },
        )}
      >
        <Image
          src="/images/donut/DonutInBox.png"
          alt="DONUTEZ - donut is cooked"
          layout="fill"
          objectFit="contain"
        />
      </div>
    </div>
  );
});
