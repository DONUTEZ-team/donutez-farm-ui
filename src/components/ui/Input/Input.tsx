import React, { forwardRef, ReactNode } from 'react';
import cx from 'classnames';

import s from './Input.module.sass';

export type InputProps = {
  label?: ReactNode
  error?: string
  success?: boolean
  textarea?: boolean
  inputClassName?: string
} & React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error = '',
  success = false,
  className,
  inputClassName,
  textarea,
  value,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const compoundClassName = cx(
    s.root,
    { [s.error]: error },
    { [s.success]: success },
    className,
  );

  return (
    <label className={compoundClassName}>
      {label && (
      <p className={s.label}>
        {label}
      </p>
      )}
      {textarea ? (
        <textarea
          {...props}
          className={cx(s.input, s.textarea, inputClassName)}
          value={value}
        />
      ) : (
        <input
          {...props}
          className={cx(s.input, inputClassName)}
          ref={ref}
          value={value}
        />
      )}
      <div className={s.errorContainer}>
        {error && <div className={s.errorText}>{error}</div>}
      </div>
    </label>
  );
});
