import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverable = false,
  glass = false,
  glow = false,
  onClick,
  ...props
}) => {
  return (
    <div
      className={`ui-card ${hoverable ? 'ui-card-hover' : ''} ${glass ? 'ui-card-glass' : ''} ${glow ? 'ui-card-glow' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};
