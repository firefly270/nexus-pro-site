/* eslint-disable react-refresh/only-export-components */
import { type ReactNode } from 'react'
import type { Vendor } from '../types'
import { useBoundStore } from '../store/useBoundStore'

export function VendorProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function useVendor() {
  const vendor = useBoundStore((s) => s.vendor)
  const config = useBoundStore((s) => s.config)
  const chapters = useBoundStore((s) => s.chapters)
  const setVendor = useBoundStore((s) => s.setVendor)
  const clearVendor = useBoundStore((s) => s.clearVendor)

  return {
    vendor,
    setVendor: (v: Vendor) => setVendor(v),
    clearVendor,
    config,
    chapters,
    isSelected: vendor !== null,
  }
}
