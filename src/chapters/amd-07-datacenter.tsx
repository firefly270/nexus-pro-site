import ChapterOverlay from '../components/ChapterOverlay'
import ChapterText from '../components/ChapterText'
import BentoGrid from '../components/BentoGrid'
import { amdCards } from '../constants/amd'

export default function AMDChapter07() {
  const cards = amdCards['ch-amd-07']
  return (
    <ChapterOverlay id="ch-amd-07">
      <ChapterText label="Chapter 7" title="EPYC & Instinct (2017–2026)">
        <p>AMD's data center story is as remarkable as its consumer comeback. <strong>EPYC</strong> (Naples, 2017) was the first server CPU to use the Zen chiplet architecture, and it gave AMD a foothold in a market Intel had owned for two decades. Each generation — Rome, Milan, Genoa, Turin — brought more cores, more memory channels, and more marketshare.</p>
        <p>The <strong>AMD Instinct MI300X</strong> is AMD's most ambitious chip ever: 146 billion transistors across 13 chiplets, 192GB of HBM3 memory, and CDNA 3 architecture designed for large language model training. It competes directly with NVIDIA's H100 and B200 in the AI data center.</p>
        <p>With the unified ROCm software stack and Infinity Architecture connecting EPYC CPUs to Instinct GPUs over coherent memory fabrics, AMD offers the industry's only CPU+GPU platform under one roof. The bet Dr. Su made in 2014 — that AMD's integration of CPU and GPU expertise would win — has finally paid off.</p>
      </ChapterText>
      <BentoGrid cards={cards} />
    </ChapterOverlay>
  )
}
