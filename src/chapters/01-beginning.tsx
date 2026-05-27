import ChapterOverlay from '../components/ChapterOverlay'
import ChapterText from '../components/ChapterText'
import GPUCard from '../components/GPUCard'
import { gpus } from '../constants/gpus'

export default function ChapterBeginning() {
  return (
    <ChapterOverlay id="ch-01-beginning" width="wide">
      <ChapterText label="Chapter 1" title="The Beginning (1993–1999)" align="left">
        <p>NVIDIA was founded in 1993 by Jensen Huang, Chris Malachowsky, and Curtis Priem around a bold idea: that the future of computing would be visual. Their first chip, the NV1 in 1995, used a quirky quadratic texture mapping approach. It wasn't a hit, but it taught them what mattered.</p>
        <p>Everything changed in 1997. The RIVA 128 brought 128-bit 2D/3D acceleration to the masses and became NVIDIA's first breakout product. It was fast, cheap, and compatible — a combination that would define the company for decades.</p>
        <p>By 1999, NVIDIA had crushed its rival 3Dfx with the RIVA TNT2 and then delivered the <strong>GeForce 256</strong> — the world's first GPU (Graphics Processing Unit). Hardware transform and lighting meant CPUs were no longer responsible for 3D math. It was a revolution.</p>
      </ChapterText>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {gpus.ch01!.map((gpu) => (
          <GPUCard key={gpu.name} {...gpu} />
        ))}
      </div>
    </ChapterOverlay>
  )
}
