import ChapterOverlay from '../components/ChapterOverlay'
import ChapterText from '../components/ChapterText'
import GPUCard from '../components/GPUCard'
import { gpus } from '../constants/gpus'

export default function ChapterAI() {
  return (
    <ChapterOverlay id="ch-06-ai">
      <ChapterText label="Chapter 6" title="The AI Era — Consumer GPUs (2022–2025)">
        <p>Ada Lovelace (RTX 4090) arrived on TSMC's 4nm process with 76.3 billion transistors. DLSS 3 introduced Frame Generation — AI creating entire frames between rendered ones. The result: a 4x performance uplift in supported titles. For the first time, a GPU's AI capabilities mattered as much as its raw shader count.</p>
        <p>Blackwell (RTX 5090) pushed even further: 92.2 billion transistors, GDDR7 memory, and DLSS 4 Multi Frame Generation. Neural rendering techniques began replacing traditional rasterization pipelines. The GPU was no longer just rendering pixels — it was <strong>predicting</strong> them.</p>
      </ChapterText>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {gpus.ch06!.map((gpu) => (
          <GPUCard key={gpu.name} {...gpu} />
        ))}
      </div>
    </ChapterOverlay>
  )
}
