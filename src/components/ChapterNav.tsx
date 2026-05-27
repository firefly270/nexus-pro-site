import { useEffect, useRef, useState } from 'react';
import { useVendor } from '../context/VendorContext';

function getCurrentIndex(ids: string[]): number {
  const sy = window.scrollY + 200;
  for (let i = ids.length - 1; i >= 0; i--) {
    const id = ids[i];
    if (!id) continue;
    const el = document.getElementById(id);
    if (el && sy >= el.offsetTop) return i;
  }
  return -1;
}

export default function ChapterNav() {
  const { chapters, isSelected } = useVendor();
  const [current, setCurrent] = useState(-1);
  const ticking = useRef(false);

  const chapterIds = chapters.map(c => c.id);

  useEffect(() => {
    if (!isSelected) return;

    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          setCurrent(getCurrentIndex(chapterIds));
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [chapterIds, isSelected]);

  const prevCh = current > 0 ? chapters[current - 1] : null;
  const nextCh = current >= 0 && current < chapters.length - 1 ? chapters[current + 1] : null;

  if (!isSelected || (!prevCh && !nextCh)) return null;

  return (
    <nav aria-label="Chapter navigation" className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-2">
      {prevCh && (
        <button
          onClick={() => {
            document.getElementById(prevCh.id)?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="group flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-3 py-2 rounded-lg hover:bg-zinc-900/50"
          aria-label={`Previous chapter: ${prevCh.label}`}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7"/></svg>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">{prevCh.label}</span>
        </button>
      )}
      {nextCh && (
        <button
          onClick={() => {
            document.getElementById(nextCh.id)?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="group flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-3 py-2 rounded-lg hover:bg-zinc-900/50"
          aria-label={`Next chapter: ${nextCh.label}`}
        >
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">{nextCh.label}</span>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
        </button>
      )}
    </nav>
  );
}
