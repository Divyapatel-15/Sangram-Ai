import React from 'react';

export const Badge = ({
  children,
  variant = 'default', // default, cyan, blue, success, warning, error, purple
  size = 'md', // sm, md
  className = '',
  dot = false,
  ...props
}) => {
  return (
    <span className={`ui-badge ui-badge-${variant} ui-badge-${size} ${className}`} {...props}>
      {dot && <span className="ui-badge-dot"></span>}
      {children}
    </span>
  );
};
