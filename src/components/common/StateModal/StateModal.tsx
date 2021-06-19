import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import cx from 'classnames';
import Lottie from 'react-lottie';
import ReactCanvasConfetti from 'react-canvas-confetti';

import { randomInRange } from '@utils/helpers';
import { Button } from '@components/ui/Button';
import { Modal, ModalProps } from '@components/ui/Modal';
import DonutError from '@icons/DonutError.svg';
import DonutSuccess from '@icons/DonutSuccess.svg';

import AnimationData from './donut-loading.json';
import s from './StateModal.module.sass';

const lottieOptions = {
  loop: true,
  autoplay: true,
  animationData: AnimationData,
  rendererSettings: {
    preserveAspectRatio: 'none',
  },
};

const canvasStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  zIndex: 120,
};

const getConfettiAnimationSettings = (originXA: number, originXB: number) => ({
  startVelocity: 30,
  spread: 360,
  ticks: 60,
  zIndex: 0,
  particleCount: 150,
  origin: {
    x: randomInRange(originXA, originXB),
    y: Math.random() - 0.2,
  },
});

export enum ModalStatuses {
  Default,
  Error,
  Pending,
  Success,
}

type StateModalProps = {
  status: ModalStatuses
  message: string | ReactNode | null
  className?: string
} & ModalProps;

export const StateModal: React.FC<StateModalProps> = ({
  status,
  message,
  onRequestClose,
  className,
  innerClassName,
  ...props
}) => {
  const animationConfettiInstance = useRef(null);

  const nextConfettiTickAnimation = useCallback(() => {
    if (animationConfettiInstance.current) {
      // @ts-ignore
      animationConfettiInstance.current(getConfettiAnimationSettings(0.1, 0.3));
      // @ts-ignore
      animationConfettiInstance.current(getConfettiAnimationSettings(0.7, 0.9));
    }
  }, []);

  const getConfettiInstance = (instance: any) => {
    animationConfettiInstance.current = instance;
  };

  useEffect(() => {
    if (status === ModalStatuses.Success) {
      let x = 0;
      const intervalID = setInterval(() => {
        nextConfettiTickAnimation();

        if (++x === 6) {
          clearInterval(intervalID);
        }
      }, 600);
      return () => clearInterval(intervalID);
    }
    return () => {};
  }, [nextConfettiTickAnimation, status]);

  return (
    <>
      <ReactCanvasConfetti
        refConfetti={getConfettiInstance}
        // @ts-ignore
        style={canvasStyles}
      />
      <Modal
        {...props}
        className={cx(s.root, className)}
        innerClassName={cx(s.inner, innerClassName)}
        onRequestClose={onRequestClose}
      >
        {status === ModalStatuses.Pending && (
          <div className={s.loading}>
            <Lottie
              options={lottieOptions}
              isClickToPauseDisabled
            />
          </div>
        )}
        {status === ModalStatuses.Error && (
          <span className={s.errorHeader}>
            <DonutError className={s.icon} />
            oooops...
          </span>
        )}
        {status === ModalStatuses.Success && (
          <span className={s.successHeader}>
            Success
            <DonutSuccess className={s.icon} />
          </span>
        )}
        <div className={s.message}>
          {message}
        </div>
        {status === ModalStatuses.Error && (
          <Button
            className={s.button}
            theme="light"
            onClick={onRequestClose}
          >
            Try once more
          </Button>
        )}
        {status === ModalStatuses.Success && (
          <Button
            className={s.button}
            theme="light"
            onClick={onRequestClose}
          >
            Got it!
          </Button>
        )}
      </Modal>
    </>
  );
};
