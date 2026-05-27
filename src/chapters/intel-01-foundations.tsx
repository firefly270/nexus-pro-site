import ChapterOverlay from '../components/ChapterOverlay'
import ChapterText from '../components/ChapterText'
import GPUCard from '../components/GPUCard'
import { intelCards } from '../constants/intel'

export default function IntelChapter01() {
  const cards = intelCards['ch-intel-01']
  return (
    <ChapterOverlay id="ch-intel-01">
      <ChapterText label="Chapter 1" title="Foundations (1971–1995)" align="left">
        <p>Intel began in 1968 as a memory company, but in 1971 they created something world-changing: the <strong>Intel 4004</strong>, the world's first microprocessor. With 2,300 transistors on a 10µm process, it had less computing power than a modern calculator — but it proved that a general-purpose CPU could fit on a single chip.</p>
        <p>The <strong>8086</strong> (1978) started the x86 architecture that still powers most computers today. IBM chose the 8088 (a cheaper 8-bit version) for the original IBM PC in 1981, and the architecture has been backward compatible ever since. Every modern x86 processor can trace its lineage to this chip.</p>
        <p>The 386 brought 32-bit computing (1985), the 486 integrated the FPU (1989), and the <strong>Pentium</strong> (1993) brought superscalar execution — running two instructions per clock cycle. Intel had become the defining microprocessor company.</p>
      </ChapterText>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards?.map(card => <GPUCard key={card.name} {...card} />)}
      </div>
    </ChapterOverlay>
  )
}
