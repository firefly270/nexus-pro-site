import { useRef } from 'react';
import type { Vendor, VendorConfig } from '../types';
import { vendorConfigs, vendorChapters } from '../constants/vendors';
import { useVendor } from '../context/VendorContext';

const allVendors: Vendor[] = ['nvidia', 'amd', 'intel'];

function VendorCard({ vc, onSelect }: { v: Vendor; vc: VendorConfig; onSelect: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 100;
    const y = (e.clientY - rect.top) / rect.height * 100;
    el.style.setProperty('--glow-x', `${x}%`);
    el.style.setProperty('--glow-y', `${y}%`);
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.removeProperty('--glow-x');
    el.style.removeProperty('--glow-y');
  };

  return (
    <button
      ref={ref}
      onClick={onSelect}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative text-left bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.15] backdrop-blur-xl rounded-2xl p-7 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden"
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{ backgroundColor: vc.color }} />
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at var(--glow-x, 50%) var(--glow-y, 50%), ${vc.color}15, transparent 60%)`,
        }}
      />
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none" style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 1px, ${vc.color} 1px, ${vc.color} 2px), repeating-linear-gradient(90deg, transparent, transparent 1px, ${vc.color} 1px, ${vc.color} 2px)`, backgroundSize: '12px 12px' }} />
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-lg mb-4 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl relative"
        style={{ background: `linear-gradient(135deg, ${vc.color}, ${vc.accent})` }}
      >
        {vc.icon}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ boxShadow: `inset 0 0 20px ${vc.color}40, 0 0 15px ${vc.color}20` }} />
      </div>
      <h3 className="text-white font-bold text-lg mb-1">{vc.label}</h3>
      <p className="text-xs font-medium mb-2" style={{ color: vc.color }}>{vc.tagline}</p>
      <p className="text-zinc-500 text-xs leading-relaxed">{vc.description}</p>
    </button>
  );
}

export default function VendorPicker() {
  const { setVendor } = useVendor();

  const selectVendor = (v: Vendor) => {
    setVendor(v);
    requestAnimationFrame(() => {
      const chs = vendorChapters[v];
      const firstCh = chs?.[0];
      if (firstCh) {
        const el = document.getElementById(firstCh.id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  };

  return (
    <section id="vendor-picker" className="relative min-h-screen flex items-center justify-center py-32 md:py-40 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-700/50 bg-zinc-900/30 text-xs text-zinc-400 mb-6 animate-fade-up">
          A 3D Scrollytelling Experience
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white leading-[1.05] animate-fade-up delay-100 max-w-4xl">
          The{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-300 via-white to-zinc-500">
            Silicon Revolution
          </span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-zinc-500 max-w-3xl leading-relaxed animate-fade-up delay-200">
          From pixels to paradigms — 30 years of processor innovation across three titans of silicon.<br />
          Choose your path.
        </p>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl animate-fade-up delay-300">
          {allVendors.map(v => {
            const vc = vendorConfigs[v];
            if (!vc) return null;
            return <VendorCard key={v} v={v} vc={vc} onSelect={() => selectVendor(v)} />;
          })}
        </div>
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-5%] left-[5%] w-[45%] h-[45%] bg-zinc-500/5 blur-[120px] rounded-full" />
        <div className="absolute top-[15%] right-[5%] w-[35%] h-[35%] bg-zinc-400/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[5%] left-[25%] w-[30%] h-[30%] bg-zinc-600/3 blur-[100px] rounded-full" />
      </div>
    </section>
  );
}
