import ChapterOverlay from '../components/ChapterOverlay'
import ChapterText from '../components/ChapterText'
import BentoGrid from '../components/BentoGrid'
import { amdCards } from '../constants/amd'

export default function AMDChapter03() {
  const cards = amdCards['ch-amd-03']
  return (
    <ChapterOverlay id="ch-amd-03">
      <ChapterText label="Chapter 3" title="Dark Times (2006–2017)">
        <p>After the ATI acquisition, AMD struggled. The Bulldozer architecture (2011) was a bet on high-frequency multicore modules that never delivered the per-core performance Intel offered. The FX-8350 had 8 cores at 4GHz, but its modules shared FPU resources — making it slower than Intel's 4-core chips in most tasks.</p>
        <p>On the GPU side, things were brighter. The <strong>GCN architecture</strong> debuted with the Radeon HD 7970 in 2012. While NVIDIA's Kepler focused on gaming efficiency, GCN was designed for compute. These GPUs found their way into cryptocurrency mining rigs and early machine learning experiments.</p>
        <p>The RX 480 (Polaris) in 2016 was a much-needed win — great 1440p performance at $199. But AMD was bleeding market share everywhere. By 2016, Intel had 80%+ of the CPU market and NVIDIA had 70%+ of discrete GPUs. AMD needed a miracle.</p>
      </ChapterText>
      <BentoGrid cards={cards} />
    </ChapterOverlay>
  )
}
