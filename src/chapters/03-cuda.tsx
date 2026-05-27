import ChapterOverlay from '../components/ChapterOverlay'
import ChapterText from '../components/ChapterText'
import GPUCard from '../components/GPUCard'
import { gpus } from '../constants/gpus'

export default function ChapterCUDA() {
  return (
    <ChapterOverlay id="ch-03-cuda">
      <ChapterText label="Chapter 3" title="CUDA Changes Everything (2007–2012)">
        <p>After G80, NVIDIA doubled down on compute. The GTX 280 (GT200) was the first billion-transistor GPU — a massive chip designed as much for science as for gaming. Tesla-branded compute cards brought CUDA to supercomputing centers worldwide.</p>
        <p>Fermi (GTX 480) was a brutal, ambitious design. It ran hot — very hot — and its 512 CUDA cores pushed the limits of what 40nm could deliver. The GTX 580 fixed the thermals and became the undisputed king. But it was <strong>Kepler</strong> (GTX 680) that truly surprised everyone: 1536 CUDA cores at 1GHz with dramatically better efficiency. GPU Boost dynamically adjusted clocks based on thermal headroom, a feature every modern card now uses.</p>
        <p>During this era, CUDA found its killer application: deep learning. Researchers discovered that NVIDIA's GPUs could train neural networks hundreds of times faster than CPUs. The AI boom had found its engine.</p>
      </ChapterText>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {gpus.ch03!.map((gpu) => (
          <GPUCard key={gpu.name} {...gpu} />
        ))}
      </div>
    </ChapterOverlay>
  )
}
