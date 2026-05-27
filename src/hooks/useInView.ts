import { useEffect, useRef, useState } from 'react';

export function useInView(threshold = 0.05, oneShot = true) {
  const [vis, setVis] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) {
        setVis(true);
      } else if (!oneShot) {
        setVis(false);
      }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, oneShot]);

  return { ref, vis };
}
