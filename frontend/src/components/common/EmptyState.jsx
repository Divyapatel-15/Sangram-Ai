import React from 'react';
import { Button } from './Button';

export const EmptyState = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div className={`ui-empty-state ${className}`}>
      {icon && <div className="empty-state-icon">{icon}</div>}
      <h4 className="empty-state-title">{title}</h4>
      {description && <p className="empty-state-desc">{description}</p>}
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction} className="empty-state-action">
          {actionText}
        </Button>
      )}
    </div>
  );
};
