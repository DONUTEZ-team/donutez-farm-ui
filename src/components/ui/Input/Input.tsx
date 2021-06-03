import React, { forwardRef, ReactNode } from 'react';
import cx from 'classnames';

import s from './Input.module.sass';

export type InputProps = {
  label?: ReactNode
  error?: string
  success?: boolean
  textarea?: boolean
  inputClassName?: string
  labelClassName?: string
} & React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error = '',
  success = false,
  className,
  inputClassName,
  labelClassName,
  textarea,
  value,
  disabled,
  ...props
}, ref) => {
  const compoundClassName = cx(
    s.root,
    { [s.success]: success },
    { [s.error]: !!error },
    { [s.disabled]: disabled },
    className,
  );

  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label className={compoundClassName}>
      {label && (
        <p className={cx(s.label, labelClassName)}>
          {label}
        </p>
      )}
      {textarea ? (
        <textarea
          {...props}
          className={cx(s.input, s.textarea, inputClassName)}
          value={value}
          disabled={disabled}
        />
      ) : (
        <input
          {...props}
          className={cx(s.input, inputClassName)}
          ref={ref}
          value={value}
          disabled={disabled}
        />
      )}
      <div className={s.errorContainer}>
        {error && <div className={s.errorText}>{error}</div>}
      </div>
    </label>
  );
});
