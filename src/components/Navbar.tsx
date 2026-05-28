import { useEffect, useRef, useState } from 'react';
import { useVendor } from '../context/VendorContext';
import { vendorConfigs } from '../constants/vendors';
import type { Vendor } from '../types';
import ShareButton from './ShareButton';
import ThemeToggle from './ThemeToggle';
import AudioToggle from './AudioToggle';
import { announce } from './AccessibleAnnouncer';

import { AudioEngine } from '../utils/audioManager';

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
            if (r !== undefined && sy >= r) { setCurrent(i); found = true; break; }
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
    const onEscape = () => setMenuOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('escape-pressed', onEscape);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('escape-pressed', onEscape);
    };
  }, []);

  const label = chapters[current]?.label ?? '';

  const switchVendor = (v: Vendor) => {
    const vc = vendorConfigs[v];
    AudioEngine.playSwoosh(vendor ? 'down' : 'up');
    announce(`Switched to ${vc?.label ?? v}`);
    setVendor(v);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearVendor = () => {
    AudioEngine.playSwoosh('down');
    announce('Showing all vendors');
    clearVendor();
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {isSelected && (
        <div className="fixed top-0 left-0 right-0 z-[60] h-[1px] pointer-events-none" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Page progress">
          <div className="h-full transition-all duration-150 ease-out" style={{ width: `${progress * 100}%`, background: `linear-gradient(to right, ${color}, ${accent})` }} />
        </div>
      )}
      <header className="fixed top-3 right-3 z-50" role="banner">
        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-xl border border-white/[0.06] rounded-full px-2.5 py-1.5 shadow-lg">
          <a href={isSelected ? `#${chapters[0]?.id ?? ''}` : '#vendor-picker'} className="flex items-center gap-1.5 text-white shrink-0" aria-label={isSelected ? `Home - ${config?.label}` : 'Choose a vendor'}>
            <span className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] shadow" style={{ background: `linear-gradient(135deg, ${color}, ${accent})` }} aria-hidden="true">{config?.icon ?? '◇'}</span>
          </a>
          <nav aria-label="Chapter quick navigation" className="hidden md:flex items-center gap-1">
            {isSelected && chapters.slice(0, 8).map((ch, i) => (
              <a key={ch.id} href={`#${ch.id}`} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === current ? 'scale-125' : 'bg-zinc-700 hover:bg-zinc-500'}`} style={{ backgroundColor: i === current ? color : undefined, boxShadow: i === current ? `0 0 4px ${color}` : undefined }} aria-label={`Go to ${ch.label}`} aria-current={i === current ? 'location' : undefined} />
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-1 text-[10px] text-zinc-500 mr-0.5">
            {isSelected && (
              <span className="truncate max-w-[80px] animate-breathe-width">{label}</span>
            )}
          </div>
          <div className="flex items-center gap-0.5">
            <div ref={menuRef} className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center justify-center w-5 h-5 text-zinc-500 hover:text-zinc-300 transition-colors rounded-full hover:bg-zinc-800/50" aria-label="Switch vendor">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-1.5 w-36 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50">
                  {allVendors.map(v => {
                    const vc = vendorConfigs[v];
                    if (!vc) return null;
                    return (
                      <button key={v} onClick={() => switchVendor(v)} className={`w-full text-left flex items-center gap-2 px-3 py-2 text-[11px] transition-all duration-200 ${vendor === v ? 'text-white bg-zinc-800 font-semibold' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50 hover:tracking-wide'}`} style={{ fontVariationSettings: vendor === v ? "'wdth' 115" : undefined }}>
                        <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: vc.color }} />
                        {vc.label}
                      </button>
                    );
                  })}
                  {isSelected && (
                    <button onClick={handleClearVendor} className="w-full text-left flex items-center gap-2 px-3 py-2 text-[11px] text-zinc-500 hover:text-white hover:bg-zinc-800/50 hover:tracking-wide border-t border-zinc-800">
                      <span className="text-zinc-600 text-xs">◇</span>
                      All
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
      </header>
    </>
  );
}