import ChapterOverlay from '../components/ChapterOverlay'
import ChapterText from '../components/ChapterText'
import BentoGrid from '../components/BentoGrid'
import { amdCards } from '../constants/amd'

export default function AMDChapter05() {
  const cards = amdCards['ch-amd-05']
  return (
    <ChapterOverlay id="ch-amd-05">
      <ChapterText label="Chapter 5" title="RDNA Rising (2019–2022)">
        <p>After years of GCN's compute-focused design, AMD re-architected its GPUs from the ground up. <strong>RDNA 1</strong> (RX 5700 XT) launched in 2019 and delivered the efficiency leap AMD needed. It wasn't a flagship killer — but it was competitive, and that was progress.</p>
        <p><strong>RDNA 2</strong> (RX 6800 XT, 6900 XT) arrived in late 2020 with hardware ray tracing, Infinity Cache, and AMD's first serious high-end GPU contender since the HD 7970. The RX 6800 XT traded blows with the RTX 3080 while consuming less power. AMD was finally back in the GPU conversation.</p>
        <p><strong>RDNA 3</strong> (RX 7900 XTX) in 2022 took the chiplet approach from Ryzen and applied it to GPUs. The GCD (Graphics Compute Die) on 5nm TSMC was surrounded by 6 MCDs (Memory Cache Dies) on 6nm. This modular GPU design was years ahead of NVIDIA's monolithic approach.</p>
      </ChapterText>
      <BentoGrid cards={cards} />
    </ChapterOverlay>
  )
}
