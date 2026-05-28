import ChapterOverlay from '../components/ChapterOverlay'
import ChapterText from '../components/ChapterText'
import BentoGrid from '../components/BentoGrid'
import { intelCards } from '../constants/intel'

export default function IntelChapter03() {
  const cards = intelCards['ch-intel-03']
  return (
    <ChapterOverlay id="ch-intel-03">
      <ChapterText label="Chapter 3" title="The Core i Era (2008–2020)">
        <p>The <strong>Core i7</strong> brand launched with Nehalem in 2008, bringing an integrated memory controller, QuickPath Interconnect, and Turbo Boost to Intel's mainstream. The i7-920 became a legend — a $300 4-core/8-thread chip that overclocked like a dream and stayed relevant for years.</p>
        <p><strong>Sandy Bridge</strong> (2011) was one of Intel's greatest achievements. The i7-2600K delivered a massive IPC improvement, integrated HD Graphics 3000 on a ring bus interconnect, and became the enthusiast's go-to for half a decade. It was so good that many users skipped Ivy Bridge and Haswell entirely.</p>
        <p>Intel's tick-tock cadence met diminishing returns after Haswell (2013). Skylake (2015) brought DDR4 but only single-digit IPC gains. By 2019, Intel was still selling quad-core i7s while AMD offered 16 cores. The "Intel Inside" complacency had created an opening — and AMD charged through it.</p>
      </ChapterText>
      <BentoGrid cards={cards} />
    </ChapterOverlay>
  )
}
