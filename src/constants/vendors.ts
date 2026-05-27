import type { Chapter, VendorConfig } from '../types'

export const vendorConfigs: Record<string, VendorConfig> = {
  nvidia: {
    label: 'NVIDIA',
    color: '#76B900',
    accent: '#00D4AA',
    bgFrom: '#76B900',
    bgTo: '#00D4AA',
    icon: '◆',
    tagline: 'GeForce + CUDA',
    description: 'The company that invented the GPU — from NV1 to Blackwell, GeForce to AI factories.',
    heroTitle: 'The GPU Revolution',
    heroSubtitle: 'From pixels to paradigms — 30 years of NVIDIA graphics innovation.',
    typeface: { displayWeight: '900', headingWeight: '700', tracking: '-0.03em' },
  },
  amd: {
    label: 'AMD',
    color: '#ED1C24',
    accent: '#FF6900',
    bgFrom: '#ED1C24',
    bgTo: '#FF6900',
    icon: '●',
    tagline: 'Radeon + Ryzen',
    description: 'From K6 to Ryzen, ATI to RDNA — AMD\'s journey of CPU and GPU innovation.',
    heroTitle: 'The AMD Story',
    heroSubtitle: 'From K6 to Ryzen, ATI to RDNA — a tale of two silicon giants in one.',
    typeface: { displayWeight: '800', headingWeight: '600', tracking: '-0.01em' },
  },
  intel: {
    label: 'Intel',
    color: '#0071C5',
    accent: '#00C7FD',
    bgFrom: '#0071C5',
    bgTo: '#00C7FD',
    icon: '■',
    tagline: 'Core + Arc',
    description: 'From the 4004 to Core Ultra, i740 to Arc — Intel\'s processor and graphics legacy.',
    heroTitle: 'The Intel Journey',
    heroSubtitle: 'From the 4004 to Core Ultra, i740 to Arc — x86 innovation across decades.',
    typeface: { displayWeight: '700', headingWeight: '500', tracking: '0em' },
  },
}

export const nvidiaChapters: Chapter[] = [
  { id: 'ch-01-beginning', label: 'The Beginning', vendor: 'nvidia' },
  { id: 'ch-02-shaders', label: 'Shader Revolution', vendor: 'nvidia' },
  { id: 'ch-03-cuda', label: 'CUDA Era', vendor: 'nvidia' },
  { id: 'ch-04-maxwell', label: 'Dominance', vendor: 'nvidia' },
  { id: 'ch-05-raytracing', label: 'Ray Tracing', vendor: 'nvidia' },
  { id: 'ch-06-ai', label: 'AI Consumer', vendor: 'nvidia' },
  { id: 'ch-06b-datacenter', label: 'Data Center', vendor: 'nvidia' },
  { id: 'ch-07-architecture', label: 'Architecture', vendor: 'nvidia' },
  { id: 'ch-08-future', label: 'Future', vendor: 'nvidia' },
]

export const amdChapters: Chapter[] = [
  { id: 'ch-amd-01', label: 'K5 to Athlon', vendor: 'amd' },
  { id: 'ch-amd-02', label: 'ATI + Opteron', vendor: 'amd' },
  { id: 'ch-amd-03', label: 'Dark Times', vendor: 'amd' },
  { id: 'ch-amd-04', label: 'Ryzen Revival', vendor: 'amd' },
  { id: 'ch-amd-05', label: 'RDNA Rising', vendor: 'amd' },
  { id: 'ch-amd-06', label: 'Current Era', vendor: 'amd' },
  { id: 'ch-amd-07', label: 'Data Center', vendor: 'amd' },
]

export const intelChapters: Chapter[] = [
  { id: 'ch-intel-01', label: 'Foundations', vendor: 'intel' },
  { id: 'ch-intel-02', label: 'Pentium Era', vendor: 'intel' },
  { id: 'ch-intel-03', label: 'Core i Era', vendor: 'intel' },
  { id: 'ch-intel-04', label: 'GPU Attempts', vendor: 'intel' },
  { id: 'ch-intel-05', label: 'Hybrid Era', vendor: 'intel' },
  { id: 'ch-intel-06', label: 'Arc & Arrow', vendor: 'intel' },
  { id: 'ch-intel-07', label: 'Xeon', vendor: 'intel' },
]

export const vendorChapters: Record<string, Chapter[]> = {
  nvidia: nvidiaChapters,
  amd: amdChapters,
  intel: intelChapters,
}
