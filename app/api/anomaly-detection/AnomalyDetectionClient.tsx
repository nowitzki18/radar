'use client';

import { useEffect } from 'react';

export default function AnomalyDetectionClient() {
  useEffect(() => {
    // Only run on client side, not during SSR
    if (typeof window === 'undefined') return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/anomaly-detection');
        if (!response.ok) {
          console.warn('Anomaly detection API returned error:', response.status);
        }
      } catch (error) {
        // Silently fail - don't crash the app
        console.warn('Anomaly detection error (non-critical):', error);
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return null;
}

