import ChapterOverlay from '../components/ChapterOverlay'
import ChapterText from '../components/ChapterText'
import GPUCard from '../components/GPUCard'
import { amdCards } from '../constants/amd'

export default function AMDChapter06() {
  const cards = amdCards['ch-amd-06']
  return (
    <ChapterOverlay id="ch-amd-06">
      <ChapterText label="Chapter 6" title="Current Era (2022–2026)">
        <p><strong>Zen 4</strong> (Ryzen 7000) brought AMD to 5nm, DDR5, and PCIe 5.0 with the new AM5 platform. The 16-core Ryzen 9 7950X led the desktop market in multi-threaded performance. <strong>Zen 5</strong> (Ryzen 9000) in 2024 pushed IPC higher with a completely redesigned front-end.</p>
        <p>On the GPU side, <strong>RDNA 4</strong> (RX 9070 XT) launched with GDDR7 memory, FSR 4 AI upscaling, and significantly improved ray tracing performance. AMD adopted a more focused strategy — targeting the high-volume mainstream with great rasterization and competitive RT at attractive prices.</p>
        <p>For pro users, the <strong>Threadripper 7995WX</strong> delivered 96 cores of Zen 4 performance in the TRX50 platform. With 350W TDP and STRIX HALO bringing 128GB unified memory to laptops, AMD's chiplet architecture scaled from the data center to your backpack.</p>
      </ChapterText>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards?.map(card => <GPUCard key={card.name} {...card} />)}
      </div>
    </ChapterOverlay>
  )
}
