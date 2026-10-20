import React from 'react';

export const Skeleton = ({
  width = '100%',
  height = '16px',
  borderRadius = '4px',
  className = ''
}) => {
  return (
    <div
      className={`ui-skeleton ${className}`}
      style={{ width, height, borderRadius }}
      aria-hidden="true"
    />
  );
};
