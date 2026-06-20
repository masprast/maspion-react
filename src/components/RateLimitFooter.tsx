import React, { useState, useEffect } from 'react';

const RateLimitFooter: React.FC = () => {
  const [rateLimit, setRateLimit] = useState<{ limit: string, remaining: string, used: string, reset: string } | null>(null);

  useEffect(() => {
    const handleRateLimit = (e: any) => {
      setRateLimit(e.detail);
    };

    window.addEventListener('github-ratelimit', handleRateLimit);
    return () => window.removeEventListener('github-ratelimit', handleRateLimit);
  }, []);

  if (!rateLimit) return null;

  return (
    <div className="mt-8 pt-6 border-t border-[#ccc] text-center text-xs text-[#666]">
      <p>API Limit: <span className="font-semibold text-[#333]">{rateLimit.used} / {rateLimit.limit}</span> terpakai</p>
      <p className="mt-1">Tersisa: <span className="font-semibold text-[#333]">{rateLimit.remaining}</span> requests</p>
    </div>
  );
};

export default RateLimitFooter;
