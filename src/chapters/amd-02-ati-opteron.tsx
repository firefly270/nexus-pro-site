import ChapterOverlay from '../components/ChapterOverlay'
import ChapterText from '../components/ChapterText'
import GPUCard from '../components/GPUCard'
import { amdCards } from '../constants/amd'

export default function AMDChapter02() {
  const cards = amdCards['ch-amd-02']
  return (
    <ChapterOverlay id="ch-amd-02">
      <ChapterText label="Chapter 2" title="ATI + Opteron (2000–2006)">
        <p>While AMD's CPUs dominated, ATI Technologies was NVIDIA's fiercest rival in graphics. The <strong>Radeon 9700 Pro</strong> (R300) launched in 2002 and was a masterpiece — it outperformed the GeForce FX 5800 so decisively that it forced NVIDIA back to the drawing board.</p>
        <p>In 2005, the Opteron 250 brought dual-core x86-64 to servers, and AMD's server market share peaked at over 25%. Meanwhile, ATI's Radeon X1900 XTX packed 48 pixel shader processors and competed at the very high end.</p>
        <p>2006 changed everything. AMD acquired ATI for $5.4 billion. The deal created the only company capable of making both high-performance CPUs and GPUs. It was a bet that fusion of CPU and GPU would define the future — and it did, just not the way anyone expected.</p>
      </ChapterText>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards?.map(card => <GPUCard key={card.name} {...card} />)}
      </div>
    </ChapterOverlay>
  )
}
