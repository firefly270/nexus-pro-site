import ChapterOverlay from '../components/ChapterOverlay'
import ChapterText from '../components/ChapterText'
import GPUCard from '../components/GPUCard'
import { gpus } from '../constants/gpus'

export default function ChapterDataCenter() {
  return (
    <ChapterOverlay id="ch-06b-datacenter">
      <ChapterText label="Chapter 6b" title="The Invisible Giant — Data Center (2022–2025)">
        <p>While gamers know GeForce, NVIDIA's biggest business is now data center. The <strong>H100 Hopper</strong> became the engine behind ChatGPT, Stable Diffusion, and most major AI models. Its Transformer Engine and FP8 precision were designed specifically for large language models, making it the most sought-after chip in the world.</p>
        <p>The <strong>B200 Blackwell</strong> continued this trajectory with 208 billion transistors, a dual-die design, and second-gen Transformer Engine supporting FP6 and FP4 precisions. The GB200 NVL72 connected 72 GPUs as one massive accelerator — an "AI factory" in a single rack.</p>
        <p><strong>Blackwell Ultra GB300</strong> pushed further with 288GB of HBM3e memory and 1.5x the AI performance of its predecessor. These chips power the hyperscale cloud — AWS, Azure, Google Cloud — and the GPU-accelerated future of enterprise AI.</p>
      </ChapterText>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {gpus.ch06b!.map((gpu) => (
          <GPUCard key={gpu.name} {...gpu} />
        ))}
      </div>
    </ChapterOverlay>
  )
}
