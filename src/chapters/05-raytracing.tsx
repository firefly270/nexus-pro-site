import ChapterOverlay from '../components/ChapterOverlay'
import ChapterText from '../components/ChapterText'
import GPUCard from '../components/GPUCard'
import { gpus } from '../constants/gpus'

export default function ChapterRayTracing() {
  return (
    <ChapterOverlay id="ch-05-raytracing">
      <ChapterText label="Chapter 5" title="The Ray Tracing Dawn (2017–2022)">
        <p>In 2018, NVIDIA did something audacious: it added dedicated hardware for ray tracing to a consumer GPU. The RTX 2080 Ti (Turing) featured three new processor types — CUDA cores, RT cores for ray tracing, and Tensor cores for AI. DLSS used the Tensor cores to reconstruct higher-resolution images from lower-resolution inputs using deep learning.</p>
        <p>Ray tracing in real-time had been a dream since Pixar's early days. Turing made it a reality. Games like Control and Cyberpunk 2077 showed off reflections, shadows, and global illumination that looked indistinguishable from cinema.</p>
        <p>The RTX 3090 (Ampere) pushed every number higher: 10496 CUDA cores, 24GB of GDDR6X, and a price tag that made it as much a workstation card as a gaming one. "Big Ampere" was for creators, AI researchers, and anyone who wanted the absolute best. <strong>Ray tracing was no longer experimental — it was expected.</strong></p>
      </ChapterText>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {gpus.ch05!.map((gpu) => (
          <GPUCard key={gpu.name} {...gpu} />
        ))}
      </div>
    </ChapterOverlay>
  )
}
