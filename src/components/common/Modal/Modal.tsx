import React from 'react';
import cx from 'classnames';
import { useTranslation } from '@i18n';
import { Modal } from '@ui/Modal';

import { Button } from '@ui/Button';
import s from './Modal.module.sass';

type ModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
  className?: string;
};

export const SuccessModal: React.FC<ModalProps> = ({
  isOpen,
  onRequestClose,
  className,
  children,
}) => {
  const { t } = useTranslation(['common']);

  return (
    <Modal className={cx(s.root, className)} isOpen={isOpen} onRequestClose={onRequestClose}>
      {children}
      <Button onClick={onRequestClose} className={s.button}>{t('common:Got it')}</Button>
    </Modal>
  );
};
