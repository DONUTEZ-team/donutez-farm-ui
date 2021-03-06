import React from 'react';
import ReactModal from 'react-modal';
import cx from 'classnames';

import s from './Modal.module.sass';

export type ModalProps = {
  innerClassName?: string;
} & ReactModal.Props;

export const Modal: React.FC<ModalProps> = ({
  className,
  overlayClassName,
  portalClassName,
  isOpen,
  onRequestClose,
  children,
  innerClassName,
  ...props
}) => {
  const compoundClassName = cx(
    s.root,
    className,
  );

  return (
    <ReactModal
      className={compoundClassName}
      appElement={
        typeof window !== 'undefined'
          ? document.querySelector('#__next')!
          : undefined
      }
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName={cx(s.overlay, overlayClassName)}
      portalClassName={cx(s.portal, { [s.hidden]: !isOpen }, portalClassName)}
      {...props}
    >
      {/* eslint-disable-next-line max-len */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div
        className={s.wrapper}
        onClick={(e) => {
          if (e.target === e.currentTarget && onRequestClose) {
            onRequestClose(e);
          }
        }}
      >
        <div className={cx(s.inner, innerClassName)}>
          {children}
        </div>
      </div>
    </ReactModal>
  );
};
