import { lazy, Suspense, useEffect } from 'react';
import { ReactLenis } from 'lenis/react';
import { Helmet } from 'react-helmet-async';
import { VendorProvider, useVendor } from './context/VendorContext';
import { mutateTransientState } from './store/useBoundStore';
import { AudioEngine } from './utils/audioManager';
import Navbar from './components/Navbar';
import Scene from './3d/Scene';
import Footer from './components/Footer';
import Hero from './chapters/Hero';
import ChapterNav from './components/ChapterNav';
import MobileNav from './components/MobileNav';
import OfflineIndicator from './components/OfflineIndicator';
import ErrorBoundary from './components/ErrorBoundary';

const ChapterBeginning = lazy(() => import('./chapters/01-beginning'));
const ChapterShaders = lazy(() => import('./chapters/02-shaders'));
const ChapterCUDA = lazy(() => import('./chapters/03-cuda'));
const ChapterMaxwell = lazy(() => import('./chapters/04-maxwell'));
const ChapterRayTracing = lazy(() => import('./chapters/05-raytracing'));
const ChapterAI = lazy(() => import('./chapters/06-ai'));
const ChapterDataCenter = lazy(() => import('./chapters/06b-datacenter'));
const ChapterArchitecture = lazy(() => import('./chapters/07-architecture'));
const ChapterFuture = lazy(() => import('./chapters/08-future'));
const AMDChapter01 = lazy(() => import('./chapters/amd-01-k5-athlon'));
const AMDChapter02 = lazy(() => import('./chapters/amd-02-ati-opteron'));
const AMDChapter03 = lazy(() => import('./chapters/amd-03-dark-times'));
const AMDChapter04 = lazy(() => import('./chapters/amd-04-ryzen-revival'));
const AMDChapter05 = lazy(() => import('./chapters/amd-05-rdna-rising'));
const AMDChapter06 = lazy(() => import('./chapters/amd-06-current-era'));
const AMDChapter07 = lazy(() => import('./chapters/amd-07-datacenter'));
const IntelChapter01 = lazy(() => import('./chapters/intel-01-foundations'));
const IntelChapter02 = lazy(() => import('./chapters/intel-02-pentium-era'));
const IntelChapter03 = lazy(() => import('./chapters/intel-03-core-i-era'));
const IntelChapter04 = lazy(() => import('./chapters/intel-04-gpu-attempts'));
const IntelChapter05 = lazy(() => import('./chapters/intel-05-hybrid-era'));
const IntelChapter06 = lazy(() => import('./chapters/intel-06-arc-arrow'));
const IntelChapter07 = lazy(() => import('./chapters/intel-07-xeon'));

function ChapterSkeleton() {
  return (
    <section className="min-h-screen flex items-center justify-center py-32 px-6">
      <div className="max-w-4xl mx-auto w-full">
        <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse mb-6" />
        <div className="h-12 w-3/4 bg-zinc-800 rounded animate-pulse mb-4" />
        <div className="h-12 w-1/2 bg-zinc-800 rounded animate-pulse mb-8" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-zinc-800/50 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-zinc-800/50 rounded animate-pulse" />
          <div className="h-4 w-4/6 bg-zinc-800/50 rounded animate-pulse" />
        </div>
      </div>
    </section>
  );
}

function VendorChapters() {
  const { vendor, isSelected } = useVendor();

  if (!isSelected) return null;

  if (vendor === 'nvidia') {
    return (
      <Suspense fallback={<ChapterSkeleton />}>
        <ErrorBoundary><ChapterBeginning /></ErrorBoundary>
        <ErrorBoundary><ChapterShaders /></ErrorBoundary>
        <ErrorBoundary><ChapterCUDA /></ErrorBoundary>
        <ErrorBoundary><ChapterMaxwell /></ErrorBoundary>
        <ErrorBoundary><ChapterRayTracing /></ErrorBoundary>
        <ErrorBoundary><ChapterAI /></ErrorBoundary>
        <ErrorBoundary><ChapterDataCenter /></ErrorBoundary>
        <ErrorBoundary><ChapterArchitecture /></ErrorBoundary>
        <ErrorBoundary><ChapterFuture /></ErrorBoundary>
      </Suspense>
    );
  }

  if (vendor === 'amd') {
    return (
      <Suspense fallback={<ChapterSkeleton />}>
        <ErrorBoundary><AMDChapter01 /></ErrorBoundary>
        <ErrorBoundary><AMDChapter02 /></ErrorBoundary>
        <ErrorBoundary><AMDChapter03 /></ErrorBoundary>
        <ErrorBoundary><AMDChapter04 /></ErrorBoundary>
        <ErrorBoundary><AMDChapter05 /></ErrorBoundary>
        <ErrorBoundary><AMDChapter06 /></ErrorBoundary>
        <ErrorBoundary><AMDChapter07 /></ErrorBoundary>
      </Suspense>
    );
  }

  if (vendor === 'intel') {
    return (
      <Suspense fallback={<ChapterSkeleton />}>
        <ErrorBoundary><IntelChapter01 /></ErrorBoundary>
        <ErrorBoundary><IntelChapter02 /></ErrorBoundary>
        <ErrorBoundary><IntelChapter03 /></ErrorBoundary>
        <ErrorBoundary><IntelChapter04 /></ErrorBoundary>
        <ErrorBoundary><IntelChapter05 /></ErrorBoundary>
        <ErrorBoundary><IntelChapter06 /></ErrorBoundary>
        <ErrorBoundary><IntelChapter07 /></ErrorBoundary>
      </Suspense>
    );
  }

  return null;
}

function useMouseGradient() {
  useEffect(() => {
    let frame: number;
    const root = document.documentElement;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        root.style.setProperty('--mouse-x', `${x}%`);
        root.style.setProperty('--mouse-y', `${y}%`);
        mutateTransientState({ mousePosition: [x / 50 - 1, -(y / 50 - 1)] });
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(frame); };
  }, []);
}

function AppContent() {
  const { vendor, config, isSelected } = useVendor();
  const title = config?.heroTitle ?? 'The Silicon Revolution';
  const desc = isSelected
    ? (config?.heroSubtitle ?? '')
    : 'From pixels to paradigms — processor innovation across three titans of silicon.';

  useMouseGradient();

  useEffect(() => {
    const onInteraction = () => {
      AudioEngine.init();
      window.removeEventListener('pointerdown', onInteraction);
      window.removeEventListener('keydown', onInteraction);
    };
    window.addEventListener('pointerdown', onInteraction, { once: true });
    window.addEventListener('keydown', onInteraction, { once: true });
    return () => {
      window.removeEventListener('pointerdown', onInteraction);
      window.removeEventListener('keydown', onInteraction);
    };
  }, []);

  return (
    <ReactLenis root options={{ duration: 1.2, smoothWheel: true }}>
      <div className="min-h-screen bg-[#030303] text-zinc-100 relative">
        <div
          className="fixed inset-0 pointer-events-none -z-[5] opacity-30 transition-opacity duration-500"
          style={{
            background: `radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${config?.color ?? '#76B900'}08, transparent 60%)`,
          }}
        />
        <Helmet>
          <html lang="en" />
          <title>{title}</title>
          <meta name="description" content={desc} />
          <meta name="keywords" content="GPU, CPU, NVIDIA, AMD, Intel, graphics, processor, scrollytelling" />
          <meta name="author" content="The Silicon Revolution" />
          <meta name="robots" content="index, follow" />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={desc} />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: title,
            description: desc,
            author: { '@type': 'Organization', name: 'The Silicon Revolution' },
            about: {
              '@type': 'Thing',
              name: 'Graphics processing unit history',
              description: 'The evolution of GPU and CPU architecture across NVIDIA, AMD, and Intel',
            },
          })}</script>
        </Helmet>
        <a href="#main-content" className="skip-to-content">Skip to content</a>
        <div className="split-root">
          <div className="split-canvas">
            <Scene key={vendor ?? 'picker'} />
          </div>
          <div className="split-content">
            <Navbar />
            <OfflineIndicator />
            <main id="main-content" role="main" tabIndex={-1}>
              <div id="scroll-container">
                <Hero />
                <VendorChapters />
              </div>
            </main>
            <Footer />
          </div>
        </div>
        <ChapterNav />
        <MobileNav />
      </div>
    </ReactLenis>
  );
}

export default function App() {
  return (
    <VendorProvider>
      <AppContent />
    </VendorProvider>
  );
}
