import React from 'react';

/* eslint-disable react/button-has-type */

export type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactChild;
};

export const Button: React.FC<Props> = ({
  children,
  ...props
}: Props) => (
  <button
    {...props}
    className="ui button teal"
  >
    {children}
  </button>
);

export default Button;
