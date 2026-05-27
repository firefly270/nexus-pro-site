import { useEffect, useRef, useState } from 'react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [atInfinity, setAtInfinity] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const sy = window.scrollY;
          setVisible(sy > 400);
          const el = document.getElementById('ch-endless');
          setAtInfinity(el ? sy >= el.offsetTop - 200 : false);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-8 right-8 z-50 w-11 h-11 rounded-full bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all shadow-lg backdrop-blur-sm"
      aria-label={atInfinity ? 'Scroll to top' : 'Scroll to top'}
      tabIndex={0}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.8)',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <span className="text-sm font-mono">{atInfinity ? '∞' : '↑'}</span>
    </button>
  );
}
