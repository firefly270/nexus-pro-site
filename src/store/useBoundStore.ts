import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Vendor, VendorConfig, Chapter } from '../types';
import { vendorConfigs, vendorChapters } from '../constants/vendors';
import type { QualityLevel, PerformanceSettings } from '../hooks/usePerformanceOrchestrator';
import type { TransitionState } from '../3d/SceneTransition';
import { createTransition } from '../3d/SceneTransition';

export interface TransientState {
  scrollProgress: number;
  mousePosition: [number, number];
}

interface StoreState {
  vendor: Vendor | null;
  config: VendorConfig | null;
  chapters: Chapter[];
  isAudioMuted: boolean;
  isGraphViewEnabled: boolean;
  quality: QualityLevel;
  settings: PerformanceSettings;
  transition: TransitionState;
  transient: TransientState;
  setVendor: (v: Vendor | null) => void;
  clearVendor: () => void;
  toggleAudio: () => void;
  toggleGraphView: () => void;
  startTransition: (to: Vendor) => void;
  updateTransition: (ts: TransitionState) => void;
}

export const useBoundStore = create<StoreState>()(
  subscribeWithSelector((set, get) => ({
    vendor: null,
    config: null,
    chapters: [],
    isAudioMuted: true,
    isGraphViewEnabled: false,
    quality: 'ultra',
    settings: { dpr: 2, particleMultiplier: 1, bloomIntensity: 1, fogEnabled: true, caEnabled: true },
    transition: { phase: 'idle', progress: 0, fromVendor: null, toVendor: null },
    transient: {
      scrollProgress: 0,
      mousePosition: [0, 0],
    },
    setVendor: (v) => {
      if (v === null) {
        set({ vendor: null, config: null, chapters: [] });
      } else {
        set({
          vendor: v,
          config: vendorConfigs[v] ?? null,
          chapters: vendorChapters[v] ?? [],
        });
      }
    },
    clearVendor: () => set({ vendor: null, config: null, chapters: [] }),
    toggleAudio: () => set((s) => ({ isAudioMuted: !s.isAudioMuted })),
    toggleGraphView: () => set((s) => ({ isGraphViewEnabled: !s.isGraphViewEnabled })),
    startTransition: (to) => {
      const { vendor } = get()
      set({ transition: createTransition(vendor, to) })
    },
    updateTransition: (ts) => set({ transition: ts }),
  })),
);

export function mutateTransientState(updates: Partial<TransientState>) {
  const state = useBoundStore.getState();
  useBoundStore.setState({ transient: { ...state.transient, ...updates } });
}
