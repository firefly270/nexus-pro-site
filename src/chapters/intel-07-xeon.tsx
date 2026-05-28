import ChapterOverlay from '../components/ChapterOverlay'
import ChapterText from '../components/ChapterText'
import BentoGrid from '../components/BentoGrid'
import { intelCards } from '../constants/intel'

export default function IntelChapter07() {
  const cards = intelCards['ch-intel-07']
  return (
    <ChapterOverlay id="ch-intel-07">
      <ChapterText label="Chapter 7" title="Xeon (2017–2026)">
        <p>Intel's Xeon processors power the majority of the world's data centers. The <strong>Xeon Platinum 8380</strong> (Ice Lake-SP, 2021) brought 40 cores of Ice Lake architecture, PCIe 4.0, and 8-channel DDR4-3200 to enterprise servers. With SGX (Software Guard Extensions) for confidential computing and AVX-512 for AI workloads, it was Intel's most advanced server chip.</p>
        <p><strong>Granite Rapids</strong> (Xeon 6, 2024) was Intel's answer to AMD's EPYC Genoa: 128 Performance-cores with 256 threads, 12-channel DDR5-6400 memory, 96 lanes of PCIe 5.0, and built-in AMX (Advanced Matrix Extensions) for AI inference acceleration. In the data center, Intel still commands ~75% market share despite AMD's gains.</p>
        <p>Intel's data center strategy now spans CPUs (Xeon), GPUs (Arc Flex for media, Arc Pro for visualization), and AI accelerators (Gaudi 3, upcoming Falcon Shores). The company that invented the microprocessor is betting on a heterogeneous computing future where CPUs, GPUs, and NPUs work together — not unlike the fusion AMD envisioned two decades ago.</p>
      </ChapterText>
      <BentoGrid cards={cards} />
    </ChapterOverlay>
  )
}
