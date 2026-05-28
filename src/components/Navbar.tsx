import { useEffect, useRef, useState } from 'react';
import { useVendor } from '../context/VendorContext';
import { vendorConfigs } from '../constants/vendors';
import type { Vendor } from '../types';
import ShareButton from './ShareButton';
import ThemeToggle from './ThemeToggle';
import AudioToggle from './AudioToggle';

const allVendors: Vendor[] = ['nvidia', 'amd', 'intel'];

export default function Navbar() {
  const { vendor, chapters, config, setVendor, clearVendor, isSelected } = useVendor();
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const ticking = useRef(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const color = config?.color ?? '#76B900';
  const accent = config?.accent ?? '#00D4AA';

  useEffect(() => {
    const ids = chapters.map(c => c.id);
    const getRanges = () => ids.map(id => {
      const el = document.getElementById(id);
      return el ? el.offsetTop - 150 : 0;
    });

    if (!isSelected) return;

    let ranges = getRanges();

    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const sy = window.scrollY;
          const docH = Math.max(document.documentElement.scrollHeight, window.innerHeight);
          setProgress(Math.min(sy / (docH - window.innerHeight), 1));

          let found = false;
          for (let i = ranges.length - 1; i >= 0; i--) {
            const r = ranges[i];
            if (r !== undefined && sy >= r) {
              setCurrent(i);
              found = true;
              break;
            }
          }
          if (!found) { setCurrent(0); }
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    const onResize = () => { ranges = getRanges(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [chapters, isSelected]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const label = chapters[current]?.label ?? '';

  const switchVendor = (v: Vendor) => {
    setVendor(v);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-zinc-800/30 bg-black/70 backdrop-blur-xl" role="banner">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <a
          href={isSelected ? `#${chapters[0]?.id ?? ''}` : '#vendor-picker'}
          className="flex items-center gap-2.5 font-bold text-sm text-white tracking-tight shrink-0"
          aria-label={isSelected ? `Home - ${config?.label}` : 'Choose a vendor'}
        >
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs shadow-lg"
            style={{ background: `linear-gradient(to tr, ${color}, ${accent})` }}
            aria-hidden="true"
          >
            {config?.icon ?? '◇'}
          </span>
          {config?.tagline ?? 'GPU Revolution'}
        </a>

        <nav aria-label="Chapter quick navigation" className="hidden md:flex items-center gap-1.5">
          {isSelected && chapters.map((ch, i) => (
            <a
              key={ch.id}
              href={`#${ch.id}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current ? 'scale-125' : 'bg-zinc-700 hover:bg-zinc-500'
              }`}
              style={{ backgroundColor: i === current ? color : undefined }}
              aria-label={`Go to ${ch.label}`}
              aria-current={i === current ? 'location' : undefined}
            />
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-1 text-xs text-zinc-500 shrink-0" aria-live="polite" aria-atomic="true">
          {isSelected && (
            <>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} aria-hidden="true" />
              {label}
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-2 py-1.5 rounded-lg hover:bg-zinc-900/50"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {isSelected ? config?.label ?? 'Vendor' : 'Vendors'}
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50">
                {allVendors.map(v => {
                  const vc = vendorConfigs[v];
                  if (!vc) return null;
                  return (
                    <button
                      key={v}
                      onClick={() => switchVendor(v)}
                      className={`w-full text-left flex items-center gap-2 px-4 py-2.5 text-xs transition-colors ${
                        vendor === v ? 'text-white bg-zinc-800' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                      }`}
                    >
                      <span className="w-3 h-3 rounded" style={{ backgroundColor: vc.color }} />
                      {vc.label}
                    </button>
                  );
                })}
                {isSelected && (
                  <button
                    onClick={() => { clearVendor(); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-xs text-zinc-500 hover:text-white hover:bg-zinc-800/50 border-t border-zinc-800"
                  >
                    <span className="text-zinc-600">◇</span>
                    All Vendors
                  </button>
                )}
              </div>
            )}
          </div>
          <AudioToggle />
          <ShareButton />
          <ThemeToggle />
        </div>
      </div>

      {isSelected && (
        <div className="h-0.5 bg-zinc-800/50 relative" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Page progress">
          <div
            className="h-full transition-all duration-150 ease-out relative"
            style={{ width: `${progress * 100}%`, background: `linear-gradient(to right, ${color}, ${accent})` }}
          >
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
              style={{
                backgroundColor: accent,
                boxShadow: `0 0 8px ${accent}`,
              }}
            />
          </div>
        </div>
      )}
    </header>
  );
}
