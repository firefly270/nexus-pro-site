import ChapterOverlay from '../components/ChapterOverlay'
import ChapterText from '../components/ChapterText'
import GPUCard from '../components/GPUCard'
import { gpus } from '../constants/gpus'

export default function ChapterShaders() {
  return (
    <ChapterOverlay id="ch-02-shaders">
      <ChapterText label="Chapter 2" title="The Shader Revolution (2000–2006)">
        <p>The GeForce 3, released in 2001, introduced programmable vertex and pixel shaders. Graphics were no longer about fixed-function pipelines — developers could now write code that ran directly on the GPU. This was the seed of everything that followed.</p>
        <p>Not every generation was a winner. The GeForce FX 5800 (NV30) was loud, hot, and struggled against ATI's Radeon 9700. Its "Dustbuster" cooler became infamous. But NVIDIA learned, regrouped, and came back with the GeForce 6800 Ultra — a true powerhouse that reclaimed the performance crown.</p>
        <p>Then came the legend: the <strong>GeForce 8800 GTX</strong> (G80) in 2006. It was the first GPU with unified shaders — 128 stream processors that could handle vertex, pixel, and geometry workloads interchangeably. More importantly, G80 introduced <strong>CUDA</strong>, a programming model that let developers use the GPU for general-purpose computing. The GPU was no longer just for games.</p>
      </ChapterText>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {gpus.ch02!.map((gpu) => (
          <GPUCard key={gpu.name} {...gpu} />
        ))}
      </div>
    </ChapterOverlay>
  )
}
