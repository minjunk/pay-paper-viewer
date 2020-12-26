import React from 'react';
import cx from 'classnames';

/* eslint-disable react/button-has-type */

export type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactChild;
  className?: string;
};

export const Button: React.FC<Props> = ({
  children,
  className,
  ...props
}: Props) => (
  <button
    {...props}
    className={cx('ui button ', className)}
  >
    {children}
  </button>
);

export default Button;
