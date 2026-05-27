import { vendorChapters } from './vendors'

export { vendorConfigs, nvidiaChapters, amdChapters, intelChapters, vendorChapters } from './vendors'
export { gpus } from './gpus'
export { amdCards } from './amd'
export { intelCards } from './intel'

export const chapters = vendorChapters.nvidia!
export const chapterIds = chapters.map(c => c.id)

export function getChapters(vendor?: string) {
  if (vendor && vendor in vendorChapters) return vendorChapters[vendor]
  return vendorChapters.nvidia
}
