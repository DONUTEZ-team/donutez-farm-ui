import React from 'react';
import cx from 'classnames';

import CheckMark from '@icons/CheckMark.svg';

import s from './CheckBox.module.sass';

type CheckBoxProps = {
  label: string
} & (React.InputHTMLAttributes<HTMLInputElement>);

export const CheckBox: React.FC<CheckBoxProps> = ({
  label,
  className,
  id,
  ...props
}) => (
  <label htmlFor={id} className={cx(s.root, className)}>
    {label}
    <input
      type="checkbox"
      className={s.input}
      id={id}
      {...props}
    />
    <span className={s.checkmark}>
      <CheckMark className={s.icon} />
    </span>
  </label>
);
