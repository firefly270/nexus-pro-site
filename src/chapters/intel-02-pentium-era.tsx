import ChapterOverlay from '../components/ChapterOverlay'
import ChapterText from '../components/ChapterText'
import BentoGrid from '../components/BentoGrid'
import { intelCards } from '../constants/intel'

export default function IntelChapter02() {
  const cards = intelCards['ch-intel-02']
  return (
    <ChapterOverlay id="ch-intel-02">
      <ChapterText label="Chapter 2" title="The Pentium Era (1995–2006)">
        <p>The <strong>Pentium Pro</strong> (1995) introduced out-of-order execution — a design so advanced that its P6 architecture would evolve into the Pentium II, III, and eventually the Core architecture. It was the foundation Intel built upon for over a decade.</p>
        <p>The <strong>Pentium 4</strong>'s NetBurst architecture chased gigahertz at any cost. The Northwood core hit 3.06GHz with Hyper-Threading, making a single CPU appear as two to the operating system. But NetBurst ran hot and the pipeline was so deep (20-31 stages) that branch mispredictions were devastating.</p>
        <p>By 2006, Intel had hit a wall. The Pentium 4 Extreme Edition ran at 130W+, and AMD's Athlon 64 was faster and cooler. Intel's response was a complete reset: the <strong>Core 2 Duo</strong>, based on the efficient Core architecture from the Pentium M team. It doubled performance at half the power. NetBurst was dead. The Core era had begun.</p>
      </ChapterText>
      <BentoGrid cards={cards} />
    </ChapterOverlay>
  )
}
