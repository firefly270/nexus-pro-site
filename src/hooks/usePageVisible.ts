import { useEffect, useRef } from 'react';

export function usePageVisible() {
  const pageVisibleRef = useRef(true);

  useEffect(() => {
    const onVisChange = () => { pageVisibleRef.current = !document.hidden; };
    document.addEventListener('visibilitychange', onVisChange);
    return () => document.removeEventListener('visibilitychange', onVisChange);
  }, []);

  return pageVisibleRef;
}
