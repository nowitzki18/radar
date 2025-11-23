'use client';

import { useEffect } from 'react';

export default function AnomalyDetectionClient() {
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await fetch('/api/anomaly-detection');
      } catch (error) {
        console.error('Anomaly detection error:', error);
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return null;
}

