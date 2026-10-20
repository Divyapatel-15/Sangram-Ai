import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="not-found-page-view text-center py-24">
      <div className="section-container max-w-lg mx-auto">
        <div className="error-glitch-badge">404</div>
        <h1 className="error-title mt-4">Chamber Not Found</h1>
        <p className="error-sub text-muted mt-2">
          The dialectic coordinates you requested do not exist in the Sangram AI arena. It may have been moved or archived.
        </p>

        <div className="error-actions mt-8 flex justify-center gap-4">
          <Link to="/home">
            <Button variant="outline">
              ← Return Home
            </Button>
          </Link>
          <Link to="/app">
            <Button variant="primary" icon="📊">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
