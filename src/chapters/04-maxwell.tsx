import ChapterOverlay from '../components/ChapterOverlay'
import ChapterText from '../components/ChapterText'
import BentoGrid from '../components/BentoGrid'
import { gpus } from '../constants/gpus'

export default function ChapterMaxwell() {
  return (
    <ChapterOverlay id="ch-04-maxwell">
      <ChapterText label="Chapter 4" title="Efficiency & Dominance (2013–2016)">
        <p>With Kepler perfected as the GTX 780 Ti, NVIDIA turned its attention to efficiency. Maxwell (GTX 980 Ti) delivered a staggering performance-per-watt improvement — nearly 2x over Kepler. This wasn't just a new chip; it was a new philosophy. Dynamic Super Resolution let you render at higher resolutions and downsample. VXGI brought real-time voxel global illumination.</p>
        <p>If Maxwell was brilliant, <strong>Pascal</strong> (GTX 1080 Ti) was legendary. Built on 16nm FinFET, GP102 packed 3584 CUDA cores, 11GB of GDDR5X, and a clock speed that breached 1.5GHz out of the box. The 1080 Ti was the card every gamer wanted and every enthusiast remembers. It remained relevant for years — a testament to how far ahead of its time it was.</p>
        <p>This era cemented NVIDIA's dominance. AMD's GCN architecture couldn't keep up, and NVIDIA had the high-end market entirely to itself.</p>
      </ChapterText>
      <BentoGrid cards={gpus.ch04!} />
    </ChapterOverlay>
  )
}
