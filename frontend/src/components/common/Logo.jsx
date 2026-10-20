import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({
  size = 'md', // sm: 24px, md: 32px, lg: 40px, xl: 52px
  showWordmark = true,
  href = '/home',
  className = '',
  imgClassName = '',
  textClassName = ''
}) => {
  const sizeMap = {
    xs: 20,
    sm: 26,
    md: 32,
    lg: 40,
    xl: 52
  };

  const px = typeof size === 'number' ? size : sizeMap[size] || 32;

  const content = (
    <div className={`brand-logo-component ${className}`}>
      <img
        src="/sangram-logo.png"
        alt="Sangram AI Logo"
        width={px}
        height={px}
        className={`brand-logo-img ${imgClassName}`}
        style={{
          width: `${px}px`,
          height: `${px}px`,
          objectFit: 'contain',
          borderRadius: '8px',
          flexShrink: 0
        }}
      />
      {showWordmark && (
        <span className={`brand-wordmark ${textClassName}`}>
          Sangram<span className="brand-accent">AI</span>
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link to={href} className="brand-logo-link" aria-label="Sangram AI Home">
        {content}
      </Link>
    );
  }

  return content;
};
