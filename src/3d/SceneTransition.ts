import type { Vendor } from '../types'

export type TransitionPhase = 'idle' | 'diving' | 'tunnel' | 'emerging'

export interface TransitionState {
  phase: TransitionPhase
  progress: number
  fromVendor: Vendor | null
  toVendor: Vendor | null
}

const DURATION_DIVING = 0.6
const DURATION_TUNNEL = 0.8
const DURATION_EMERGING = 0.6
const TOTAL_DURATION = DURATION_DIVING + DURATION_TUNNEL + DURATION_EMERGING

export function createTransition(from: Vendor | null, to: Vendor | null): TransitionState {
  return {
    phase: 'diving',
    progress: 0,
    fromVendor: from,
    toVendor: to,
  }
}

export function tickTransition(state: TransitionState, dt: number): TransitionState {
  if (state.phase === 'idle') return state

  const newProgress = state.progress + dt / TOTAL_DURATION
  const clamped = Math.min(newProgress, 1)

  let newPhase: TransitionPhase = state.phase
  if (clamped >= 1) {
    newPhase = 'idle'
  } else if (clamped >= (DURATION_DIVING + DURATION_TUNNEL) / TOTAL_DURATION) {
    newPhase = 'emerging'
  } else if (clamped >= DURATION_DIVING / TOTAL_DURATION) {
    newPhase = 'tunnel'
  }

  return {
    phase: newPhase,
    progress: clamped,
    fromVendor: state.fromVendor,
    toVendor: state.toVendor,
  }
}

export function shouldSwapVendor(state: TransitionState): boolean {
  return state.phase === 'tunnel' && state.progress > 0.15 && state.progress < 0.6
}
