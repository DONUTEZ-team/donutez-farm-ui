/* eslint-disable react/button-has-type */
import React from 'react';
import Link, { LinkProps } from 'next/link';
import cx from 'classnames';

import s from './Button.module.sass';

type ButtonProps = {
  type?: 'button' | 'submit' | 'reset' | undefined
  theme?: keyof typeof themeClass
  size?: keyof typeof sizeClass
  external?: boolean
  className?: string
} & (
  | React.HTMLProps<HTMLButtonElement>
  | LinkProps
  | React.HTMLProps<HTMLAnchorElement>
);

const themeClass = {
  primary: s.primary,
  secondary: s.secondary,
  info: s.info,
};

const sizeClass = {
  small: s.small,
  medium: s.medium,
  large: s.large,
};

export const Button: React.FC<ButtonProps> = ({
  type = 'button',
  theme = 'primary',
  size = 'large',
  external = false,
  className,
  children,
  ...props
}) => {
  const compoundClassName = cx(
    s.root,
    themeClass[theme],
    sizeClass[size],
    className,
  );

  if ('href' in props) {
    if (external) {
      return (
        <a
          target="_blank"
          rel="noreferrer noopener"
          className={compoundClassName}
          {...(props as React.HTMLProps<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }
    return (
      <Link {...(props as LinkProps)}>
        <a className={compoundClassName}>{children}</a>
      </Link>
    );
  }

  return (
    <button
      // @ts-ignore
      type={type}
      {...(props as React.HTMLProps<HTMLButtonElement>)}
      className={compoundClassName}
    >
      {children}
    </button>
  );
};
