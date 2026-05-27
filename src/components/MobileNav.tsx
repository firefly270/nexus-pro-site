import { useEffect, useRef, useState } from 'react';
import { useVendor } from '../context/VendorContext';

export default function MobileNav() {
  const { chapters, config, isSelected } = useVendor();
  const [current, setCurrent] = useState(-1);
  const [open, setOpen] = useState(false);
  const ticking = useRef(false);
  const navRef = useRef<HTMLElement>(null);

  const chapterIds: string[] = chapters.map(c => c.id);
  const color = config?.color ?? '#76B900';

  useEffect(() => {
    if (!isSelected) return;

    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const sy = window.scrollY + 200;
          for (let i = chapterIds.length - 1; i >= 0; i--) {
            const id = chapterIds[i];
            if (!id) continue;
            const el = document.getElementById(id);
            if (el && sy >= el.offsetTop) { setCurrent(i); break; }
          }
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    const onClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [chapterIds, isSelected]);

  const navigateTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  if (!isSelected) return null;

  return (
    <nav ref={navRef} aria-label="Chapter navigation" className="mobile-chapter-nav fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-black/90 border-t border-zinc-800/50 backdrop-blur-xl px-4 py-2 flex items-center justify-between">
        <button
          onClick={() => {
            const prev = current > 0 ? chapterIds[current - 1] : undefined;
            if (prev) navigateTo(prev);
          }}
          disabled={current <= 0}
          className="w-10 h-10 flex items-center justify-center rounded-full text-zinc-400 disabled:opacity-30 hover:text-white hover:bg-zinc-900 transition-colors"
          aria-label="Previous chapter"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button
          onClick={() => setOpen(!open)}
          className="flex-1 mx-2 flex items-center justify-center gap-2 text-xs text-zinc-300 py-2 rounded-lg hover:bg-zinc-900/50 transition-colors"
          aria-label={open ? 'Close chapter menu' : 'Open chapter menu'}
          aria-expanded={open}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
          {current >= 0 ? (chapters[current]?.label ?? 'Intro') : 'Intro'}
          <svg className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <button
          onClick={() => {
            const next = current < chapters.length - 1 ? chapterIds[current + 1] : undefined;
            if (next) navigateTo(next);
          }}
          disabled={current >= chapters.length - 1}
          className="w-10 h-10 flex items-center justify-center rounded-full text-zinc-400 disabled:opacity-30 hover:text-white hover:bg-zinc-900 transition-colors"
          aria-label="Next chapter"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
      {open && (
        <div className="bg-black/95 border-t border-zinc-800/30 backdrop-blur-xl max-h-60 overflow-y-auto">
          <div className="grid grid-cols-2 gap-1 p-3">
            {chapters.map((ch, i) => (
              <button
                key={ch.id}
                onClick={() => navigateTo(ch.id)}
                className={`text-left text-xs px-3 py-2 rounded-lg transition-colors ${
                  i === current ? 'text-white' : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
                }`}
                style={i === current ? { backgroundColor: `${color}33` } : undefined}
                aria-current={i === current ? 'location' : undefined}
              >
                {ch.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
