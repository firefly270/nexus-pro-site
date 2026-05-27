import ChapterOverlay from '../components/ChapterOverlay'
import ChapterText from '../components/ChapterText'
import GPUCard from '../components/GPUCard'
import { intelCards } from '../constants/intel'

export default function IntelChapter04() {
  const cards = intelCards['ch-intel-04']
  return (
    <ChapterOverlay id="ch-intel-04">
      <ChapterText label="Chapter 4" title="GPU Ambitions (1998–2021)">
        <p>Intel has tried to enter the GPU market multiple times. The <strong>i740</strong> (1998) was their first discrete graphics attempt — an AGP 2x card with reasonable 2D performance but poor DirectX 3D support. It quickly disappeared, and Intel retreated to integrated graphics.</p>
        <p>For two decades, Intel's integrated GPUs were barely sufficient — HD Graphics, UHD Graphics — fine for office work, not for gaming. But the <strong>Iris Pro 5200</strong> (Haswell GT3e, 2014) showed what was possible with eDRAM: 128MB of L4 cache on-package that dramatically improved GPU performance.</p>
        <p>The <strong>Xe architecture</strong> (2020) marked Intel's serious return to graphics. Iris Xe integrated 96 execution units in Tiger Lake, offering competitive integrated performance. It was the foundation for Intel's next great GPU push: discrete graphics.</p>
      </ChapterText>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards?.map(card => <GPUCard key={card.name} {...card} />)}
      </div>
    </ChapterOverlay>
  )
}
