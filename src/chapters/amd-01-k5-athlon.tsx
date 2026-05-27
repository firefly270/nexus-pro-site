import ChapterOverlay from '../components/ChapterOverlay'
import ChapterText from '../components/ChapterText'
import GPUCard from '../components/GPUCard'
import { amdCards } from '../constants/amd'

export default function AMDChapter01() {
  const cards = amdCards['ch-amd-01']
  return (
    <ChapterOverlay id="ch-amd-01" width="wide">
      <ChapterText label="Chapter 1" title="From K5 to Athlon (1996–2003)" align="left">
        <p>AMD started as a second-source manufacturer for Intel, but in 1996 they launched the K5 — their first in-house x86 design. It was competitive, but not groundbreaking. That changed with the K6 series, which brought 3DNow! SIMD instructions and genuine competition to Intel's Pentium line.</p>
        <p>The Athlon in 1999 was a turning point. AMD's K7 architecture was faster than Intel's Pentium III, and the Athlon 1GHz became the first processor to break the gigahertz barrier in 2000. AMD had the performance crown — and they intended to keep it.</p>
        <p>In 2003, the <strong>Athlon 64</strong> launched with x86-64, AMD's 64-bit extension to the x86 architecture. It featured an integrated memory controller and HyperTransport interconnect — innovations Intel wouldn't match for years. AMD owned the high-end CPU market.</p>
      </ChapterText>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards?.map(card => <GPUCard key={card.name} {...card} />)}
      </div>
    </ChapterOverlay>
  )
}
