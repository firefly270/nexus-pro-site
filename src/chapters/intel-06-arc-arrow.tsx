import ChapterOverlay from '../components/ChapterOverlay'
import ChapterText from '../components/ChapterText'
import BentoGrid from '../components/BentoGrid'
import { intelCards } from '../constants/intel'

export default function IntelChapter06() {
  const cards = intelCards['ch-intel-06']
  return (
    <ChapterOverlay id="ch-intel-06">
      <ChapterText label="Chapter 6" title="Arc & Arrow (2022–2026)">
        <p>Intel's <strong>Arc A770</strong> (Alchemist, 2022) marked the company's return to discrete GPUs after 24 years. With 32 Xe cores, hardware ray tracing, XeSS upscaling, and 16GB of GDDR6, it was a compelling mid-range option. Driver maturity was the challenge — but Intel committed to rapid improvement.</p>
        <p><strong>Battlemage</strong> (Arc B580, 2024) was a major leap forward. The Xe2 HPG architecture brought significantly better performance, improved ray tracing, and XeSS 2 with Frame Generation. At its price point, it competed directly with NVIDIA's RTX 4060 and AMD's RX 7600.</p>
        <p><strong>Arrow Lake</strong> (Core Ultra 200, 2024) was Intel's biggest architectural change in years: a tiled design with separate CPU, GPU, NPU, and SoC tiles, made on a hybrid Intel 20A + TSMC 3nm process. The Core Ultra 9 285K removed Hyper-Threading but delivered better single-threaded performance through architectural improvements. With an integrated NPU delivering 13 TOPS, it was Intel's first true AI PC processor.</p>
      </ChapterText>
      <BentoGrid cards={cards} />
    </ChapterOverlay>
  )
}
