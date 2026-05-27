import { useEffect } from 'react';
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric: { name: string; value: number; rating: string }) {
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/.well-known/analytics/vitals', JSON.stringify(metric));
  }
}

export default function WebVitals() {
  useEffect(() => {
    if (import.meta.env.DEV) {
      onCLS(console.log);
      onFCP(console.log);
      onINP(console.log);
      onLCP(console.log);
      onTTFB(console.log);
    } else {
      onCLS(sendToAnalytics);
      onFCP(sendToAnalytics);
      onINP(sendToAnalytics);
      onLCP(sendToAnalytics);
      onTTFB(sendToAnalytics);
    }
  }, []);

  return null;
}
