import { useEffect, useState } from 'react';
import { ReactLenis } from 'lenis/react';
import { Helmet } from 'react-helmet-async';
import { VendorProvider, useVendor } from './context/VendorContext';
import Navbar from './components/Navbar';
import Scene from './3d/Scene';
import Footer from './components/Footer';
import Hero from './chapters/Hero';
import ChapterNav from './components/ChapterNav';
import MobileNav from './components/MobileNav';
import OfflineIndicator from './components/OfflineIndicator';
import ErrorBoundary from './components/ErrorBoundary';
import ChapterBeginning from './chapters/01-beginning';
import ChapterShaders from './chapters/02-shaders';
import ChapterCUDA from './chapters/03-cuda';
import ChapterMaxwell from './chapters/04-maxwell';
import ChapterRayTracing from './chapters/05-raytracing';
import ChapterAI from './chapters/06-ai';
import ChapterDataCenter from './chapters/06b-datacenter';
import ChapterArchitecture from './chapters/07-architecture';
import ChapterFuture from './chapters/08-future';
import AMDChapter01 from './chapters/amd-01-k5-athlon';
import AMDChapter02 from './chapters/amd-02-ati-opteron';
import AMDChapter03 from './chapters/amd-03-dark-times';
import AMDChapter04 from './chapters/amd-04-ryzen-revival';
import AMDChapter05 from './chapters/amd-05-rdna-rising';
import AMDChapter06 from './chapters/amd-06-current-era';
import AMDChapter07 from './chapters/amd-07-datacenter';
import IntelChapter01 from './chapters/intel-01-foundations';
import IntelChapter02 from './chapters/intel-02-pentium-era';
import IntelChapter03 from './chapters/intel-03-core-i-era';
import IntelChapter04 from './chapters/intel-04-gpu-attempts';
import IntelChapter05 from './chapters/intel-05-hybrid-era';
import IntelChapter06 from './chapters/intel-06-arc-arrow';
import IntelChapter07 from './chapters/intel-07-xeon';

function VendorChapters() {
  const { vendor, isSelected } = useVendor();

  if (!isSelected) return null;

  if (vendor === 'nvidia') {
    return (
      <>
        <ErrorBoundary><ChapterBeginning /></ErrorBoundary>
        <ErrorBoundary><ChapterShaders /></ErrorBoundary>
        <ErrorBoundary><ChapterCUDA /></ErrorBoundary>
        <ErrorBoundary><ChapterMaxwell /></ErrorBoundary>
        <ErrorBoundary><ChapterRayTracing /></ErrorBoundary>
        <ErrorBoundary><ChapterAI /></ErrorBoundary>
        <ErrorBoundary><ChapterDataCenter /></ErrorBoundary>
        <ErrorBoundary><ChapterArchitecture /></ErrorBoundary>
        <ErrorBoundary><ChapterFuture /></ErrorBoundary>
      </>
    );
  }

  if (vendor === 'amd') {
    return (
      <>
        <ErrorBoundary><AMDChapter01 /></ErrorBoundary>
        <ErrorBoundary><AMDChapter02 /></ErrorBoundary>
        <ErrorBoundary><AMDChapter03 /></ErrorBoundary>
        <ErrorBoundary><AMDChapter04 /></ErrorBoundary>
        <ErrorBoundary><AMDChapter05 /></ErrorBoundary>
        <ErrorBoundary><AMDChapter06 /></ErrorBoundary>
        <ErrorBoundary><AMDChapter07 /></ErrorBoundary>
      </>
    );
  }

  if (vendor === 'intel') {
    return (
      <>
        <ErrorBoundary><IntelChapter01 /></ErrorBoundary>
        <ErrorBoundary><IntelChapter02 /></ErrorBoundary>
        <ErrorBoundary><IntelChapter03 /></ErrorBoundary>
        <ErrorBoundary><IntelChapter04 /></ErrorBoundary>
        <ErrorBoundary><IntelChapter05 /></ErrorBoundary>
        <ErrorBoundary><IntelChapter06 /></ErrorBoundary>
        <ErrorBoundary><IntelChapter07 /></ErrorBoundary>
      </>
    );
  }

  return null;
}

function useMouseGradient() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  useEffect(() => {
    let frame: number;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setPos({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(frame); };
  }, []);
  return pos;
}

function AppContent() {
  const { vendor, config, isSelected } = useVendor();
  const title = config?.heroTitle ?? 'The Silicon Revolution';
  const desc = isSelected
    ? (config?.heroSubtitle ?? '')
    : 'From pixels to paradigms — processor innovation across three titans of silicon.';

  const mouseRef = useMouseGradient();

  return (
    <ReactLenis root options={{ duration: 1.2, smoothWheel: true }}>
      <div className="min-h-screen bg-[#030303] text-zinc-100 relative">
        <div
          className="fixed inset-0 pointer-events-none -z-[5] opacity-30 transition-opacity duration-500"
          style={{
            background: mouseRef
              ? `radial-gradient(800px circle at ${mouseRef.x}% ${mouseRef.y}%, ${config?.color ?? '#76B900'}08, transparent 60%)`
              : 'none',
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
            '@type': 'Article',
            headline: title,
            description: desc,
            author: { '@type': 'Organization', name: 'The Silicon Revolution' },
          })}</script>
        </Helmet>
        <a href="#main-content" className="skip-to-content">Skip to content</a>
        <Scene key={vendor ?? 'picker'} />
        <Navbar />
        <OfflineIndicator />
        <main id="main-content" role="main" tabIndex={-1}>
          <div id="scroll-container">
            <Hero />
            <VendorChapters />
          </div>
        </main>
        <Footer />
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
