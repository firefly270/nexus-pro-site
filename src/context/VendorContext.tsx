/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Vendor, VendorConfig, Chapter } from '../types'
import { vendorConfigs, vendorChapters } from '../constants/vendors'

interface VendorContextValue {
  vendor: Vendor | null
  setVendor: (v: Vendor) => void
  clearVendor: () => void
  config: VendorConfig | null
  chapters: Chapter[]
  isSelected: boolean
}

const VendorContext = createContext<VendorContextValue | null>(null)

export function VendorProvider({ children }: { children: ReactNode }) {
  const [vendor, setVendorState] = useState<Vendor | null>(null)

  const setVendor = useCallback((v: Vendor) => setVendorState(v), [])
  const clearVendor = useCallback(() => setVendorState(null), [])

  const config = vendor ? (vendorConfigs[vendor] ?? null) : null
  const chapters = vendor ? (vendorChapters[vendor] ?? []) : []
  const isSelected = vendor !== null

  return (
    <VendorContext.Provider value={{ vendor, setVendor, clearVendor, config, chapters, isSelected }}>
      {children}
    </VendorContext.Provider>
  )
}

export function useVendor() {
  const ctx = useContext(VendorContext)
  if (!ctx) throw new Error('useVendor must be used within a VendorProvider')
  return ctx
}
