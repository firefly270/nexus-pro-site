import ChapterOverlay from '../components/ChapterOverlay'
import ChapterText from '../components/ChapterText'
import BentoGrid from '../components/BentoGrid'
import { amdCards } from '../constants/amd'

export default function AMDChapter04() {
  const cards = amdCards['ch-amd-04']
  return (
    <ChapterOverlay id="ch-amd-04">
      <ChapterText label="Chapter 4" title="Ryzen Revival (2017–2022)">
        <p>Led by Dr. Lisa Su, AMD bet everything on a clean-sheet design called <strong>Zen</strong>. The Ryzen 7 1800X launched in March 2017 with 8 cores and 16 threads at $499 — offering Intel's HEDT performance at mainstream prices. The era of "Intel Inside" was over.</p>
        <p>Zen 2 (Ryzen 3000) introduced a <strong>chiplet design</strong> that would define AMD for years: compute dies on 7nm TSMC plus an I/O die on 12nm. This approach allowed AMD to scale from 6-core to 64-core chips using the same building blocks. The Ryzen 9 3950X brought 16 cores to the AM4 socket — something Intel couldn't match.</p>
        <p>The <strong>Ryzen 7 5800X3D</strong> was a technical marvel: 3D V-Cache stacked an extra 64MB of L3 cache on top of the CCD, connected through hybrid bonding. It became the fastest gaming CPU without needing higher clocks or more cores. AMD had out-innovated Intel at every level.</p>
      </ChapterText>
      <BentoGrid cards={cards} />
    </ChapterOverlay>
  )
}
