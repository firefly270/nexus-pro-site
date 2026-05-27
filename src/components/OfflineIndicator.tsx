import { useEffect, useState } from 'react';

export default function OfflineIndicator() {
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const onOff = () => setOffline(true);
    const onOn = () => setOffline(false);
    window.addEventListener('offline', onOff);
    window.addEventListener('online', onOn);
    return () => {
      window.removeEventListener('offline', onOff);
      window.removeEventListener('online', onOn);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="fixed top-14 left-0 right-0 z-40 bg-yellow-600/90 backdrop-blur-sm text-white text-xs text-center py-1.5 px-4 font-medium" role="alert">
      You are offline — some content may not be available
    </div>
  );
}
