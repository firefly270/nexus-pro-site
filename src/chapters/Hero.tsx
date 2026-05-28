import { useVendor } from '../context/VendorContext';
import VendorPicker from '../components/VendorPicker';
import { useInView } from '../hooks/useInView';

function VendorHero() {
  const { config, chapters } = useVendor();
  const { ref, vis } = useInView(0.1);
  const color = config?.color ?? '#76B900';
  const accent = config?.accent ?? '#00D4AA';

  return (
    <section id="vendor-hero" ref={ref} className="relative min-h-screen flex items-center justify-center py-32 md:py-40 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs mb-6 ${vis ? 'animate-fade-up' : 'opacity-0'}`}
          style={{ borderColor: `${color}4D`, backgroundColor: `${color}1A`, color }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: color }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: color }} />
          </span>
          A 3D Scrollytelling Experience
        </div>

        <h1 className={`text-5xl md:text-8xl font-extrabold tracking-tighter text-white leading-[1.05] ${vis ? 'animate-cinematic delay-100' : 'opacity-0'} max-w-4xl`}>
          {config?.heroTitle ?? ''}
        </h1>

        <p className={`mt-6 text-lg md:text-xl text-zinc-500 max-w-2xl leading-relaxed ${vis ? 'animate-fade-up delay-200' : 'opacity-0'}`}>
          {config?.heroSubtitle ?? ''}
        </p>

        <div className={`mt-12 flex flex-col sm:flex-row gap-4 ${vis ? 'animate-fade-up delay-300' : 'opacity-0'}`}>
          <a
            href={`#${chapters[0]?.id ?? ''}`}
            className="px-8 py-4 bg-white/5 text-white font-semibold rounded-xl border border-zinc-800 hover:bg-white/10 transition-all text-sm tracking-wide"
          >
            Begin the Journey
          </a>
          <a
            href={`#${chapters[chapters.length - 1]?.id ?? ''}`}
            className="px-8 py-4 bg-zinc-900/50 text-zinc-400 rounded-xl border border-zinc-800/50 hover:text-white transition-all text-sm tracking-wide"
          >
            Jump to the Future
          </a>
        </div>
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-5%] left-[5%] w-[45%] h-[45%]" style={{ backgroundColor: `${color}0D`, filter: 'blur(120px)', borderRadius: '50%' }} />
        <div className="absolute top-[15%] right-[5%] w-[35%] h-[35%]" style={{ backgroundColor: `${accent}0D`, filter: 'blur(120px)', borderRadius: '50%' }} />
        <div className="absolute bottom-[5%] left-[25%] w-[30%] h-[30%]" style={{ backgroundColor: `${color}08`, filter: 'blur(100px)', borderRadius: '50%' }} />
      </div>

      <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 ${vis ? 'animate-fade-in delay-500' : 'opacity-0'}`}>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-zinc-600 tracking-widest uppercase">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-zinc-700 flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-zinc-500 animate-float" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Hero() {
  const { isSelected } = useVendor();
  return isSelected ? <VendorHero /> : <VendorPicker />;
}
