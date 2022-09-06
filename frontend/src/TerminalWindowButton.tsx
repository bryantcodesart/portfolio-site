import React, { ReactNode } from 'react';
import { useTrueAfterDelay } from './useTrueAfterDelay';

const InnerButtonContent = ({ children, disabled }:{children:ReactNode, disabled:boolean}) => (
  <>
    <div
      className="absolute top-0 left-0 w-full h-full bg-black group-active:scale-75"
    />
    <div
      className={`border-[2px] border-[var(--color)]
    py-[0.5em] px-[1em] pointer-events-none
    relative
    ${disabled ? '' : `
      translate-x-[0.15em] translate-y-[0.15em]
      group-hover:translate-x-0
      group-hover:translate-y-0
      group-active:scale-75
    `}
  `}
      style={{
        backgroundColor: 'var(--bgColor)',
      }}
    >
      {children}
    </div>
  </>
);

export const TerminalWindowButton = ({
  onClick,
  children,
  className = '',
  delay = 300,
  color = 'black',
  bgColor = 'white',
  disabled = false,
  href = null,
}: {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  delay?: number;
  color?: string;
  bgColor?: string;
  disabled?: boolean;
  href?: string|null;
}) => {
  const show = useTrueAfterDelay(delay);
  const buttonProps = {
    style: {
    // @ts-ignore
      '--color': disabled ? '#444' : color,
      '--bgColor': disabled ? '#888' : bgColor,
      color: 'var(--color)',
    },
    className: `
      relative
      ${show ? '' : 'scale-0 opacity-0'}
      transition-transform ease-[steps(5)] duration-300
      group
      ${className}
    `,
    disabled,
  };

  if (href) {
    return (
      <a
        type="button"
        {...buttonProps}
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        <InnerButtonContent disabled={disabled}>{children}</InnerButtonContent>
      </a>
    );
  }

  return (
    <button
      type="button"
      {...buttonProps}
      onClick={disabled ? () => { } : onClick}
    >
      <InnerButtonContent disabled={disabled}>{children}</InnerButtonContent>
    </button>
  );
};
