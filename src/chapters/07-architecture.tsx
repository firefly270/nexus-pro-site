import ChapterOverlay from '../components/ChapterOverlay'
import ChapterText from '../components/ChapterText'
import BentoGrid from '../components/BentoGrid'
import { gpus } from '../constants/gpus'

export default function ChapterArchitecture() {
  return (
    <ChapterOverlay id="ch-07-architecture">
      <ChapterText label="Chapter 7" title="The Architecture Era — Vera Rubin (2026)">
        <p>In 2026, NVIDIA unveiled Vera Rubin — not just a GPU, but a complete platform of seven co-designed chips. Named after the astronomer who discovered dark matter, Rubin represents a fundamental shift from selling chips to selling <strong>AI factories</strong>.</p>
        <p>The Rubin GPU brings 336 billion transistors on TSMC 3nm, dual reticle-sized dies, 288GB of HBM4 memory with 22 TB/s of bandwidth, and 50 PFLOPS of FP4 inference performance. Alongside it, the <strong>Vera CPU</strong> — NVIDIA's first custom Arm-based processor with 88 Olympus cores — keeps the GPUs fed through 1.8 TB/s NVLink-C2C interconnect.</p>
        <p>The platform includes six additional chips: NVLink 6 Switch (3.6 TB/s), ConnectX-9 SuperNIC, BlueField-4 DPU, Spectrum-6 Ethernet, and Groq 3 LPU. Together they form the VR NVL72 — a complete rack-scale system where 72 Rubin GPUs act as one distributed accelerator.</p>
        <p><strong>Rubin Ultra</strong> (2027) will double performance with dual Rubin dies, reaching 100 PFLOPS and nearly 1TB of HBM4 memory. A full NVL576 rack claims 15 exaflops of FP4 inference — 14x the performance of the Blackwell Ultra generation.</p>
      </ChapterText>
      <BentoGrid cards={gpus.ch07!} />
    </ChapterOverlay>
  )
}
