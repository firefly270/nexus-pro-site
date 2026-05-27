import ChapterOverlay from '../components/ChapterOverlay'
import ChapterText from '../components/ChapterText'

export default function ChapterFuture() {
  return (
    <ChapterOverlay id="ch-08-future">
      <ChapterText label="Epilogue" title="Beyond — The Road to Feynman">
        <p>NVIDIA's journey from the NV1's 1 million transistors to Rubin Ultra's projected 600 billion is a 600,000x increase — in just over three decades. But the company shows no signs of slowing down.</p>
        <p><strong>Feynman</strong>, named after physicist Richard Feynman, is NVIDIA's next architecture beyond Rubin, expected in 2028. While details remain under wraps, NVIDIA's annual cadence guarantees it will push every boundary — more transistors, faster memory, wider interconnects, and deeper AI integration.</p>
        <p>The GPU revolution began as a quest to make pixels prettier. It evolved into a mission to make computers think. From gaming to CUDA to deep learning to AI factories, NVIDIA transformed the graphics card into the engine of human progress.</p>
        <p>From the NV1's 12 MHz to Vera Rubin's 50 PFLOPS. From 2MB of VRAM to 1TB of HBM4. From DirectX 1 to Transformer Engines. The GPU isn't just the heart of gaming anymore — it's the heart of intelligence itself.</p>
        <p className="text-[#76B900] font-semibold">The GPU revolution isn't over. It's just getting started.</p>
      </ChapterText>
    </ChapterOverlay>
  )
}
