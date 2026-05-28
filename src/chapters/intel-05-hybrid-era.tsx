import ChapterOverlay from '../components/ChapterOverlay'
import ChapterText from '../components/ChapterText'
import BentoGrid from '../components/BentoGrid'
import { intelCards } from '../constants/intel'

export default function IntelChapter05() {
  const cards = intelCards['ch-intel-05']
  return (
    <ChapterOverlay id="ch-intel-05">
      <ChapterText label="Chapter 5" title="The Hybrid Era (2021–2024)">
        <p><strong>Alder Lake</strong> (12th Gen Core, 2021) was Intel's most radical CPU redesign since Core 2 Duo. It introduced a performance-hybrid architecture with two core types: large Golden Cove P-cores for demanding tasks and compact Gracemont E-cores for background workloads. Intel's Thread Director hardware scheduler worked with Windows 11 to assign threads to the right core dynamically.</p>
        <p>The Core i9-12900K had 8 P-cores and 8 E-cores for 16 cores and 24 threads. In multi-threaded workloads, it matched AMD's 16-core Ryzen 9 5950X while using less die area. The hybrid approach was a masterstroke — Intel regained the desktop performance crown.</p>
        <p><strong>Raptor Lake</strong> (13th/14th Gen) refined the hybrid formula with 8 P-cores + 16 E-cores, reaching 6.0GHz boost on the i9-14900K. With 24 cores and 32 threads on the mainstream LGA1700 socket, Intel had answered AMD's core count challenge with a fundamentally different approach.</p>
      </ChapterText>
      <BentoGrid cards={cards} />
    </ChapterOverlay>
  )
}
