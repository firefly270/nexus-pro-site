import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Vendor, VendorConfig, Chapter } from '../types';
import { vendorConfigs, vendorChapters } from '../constants/vendors';

export interface TransientState {
  scrollProgress: number;
  mousePosition: [number, number];
}

interface StoreState {
  vendor: Vendor | null;
  config: VendorConfig | null;
  chapters: Chapter[];
  isAudioMuted: boolean;
  transient: TransientState;
  setVendor: (v: Vendor | null) => void;
  clearVendor: () => void;
  toggleAudio: () => void;
}

export const useBoundStore = create<StoreState>()(
  subscribeWithSelector((set) => ({
    vendor: null,
    config: null,
    chapters: [],
    isAudioMuted: true,
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
  })),
);

export function mutateTransientState(updates: Partial<TransientState>) {
  const state = useBoundStore.getState();
  Object.assign(state.transient, updates);
}
