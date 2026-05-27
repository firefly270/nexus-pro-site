import { useVendor } from '../context/VendorContext'
import { vendorConfigs } from '../constants/vendors'

export default function Footer() {
  const { vendor, setVendor } = useVendor()
  const config = vendor ? (vendorConfigs[vendor] ?? null) : null
  const color = config?.color ?? '#76B900'
  const accent = config?.accent ?? '#00D4AA'

  return (
    <footer className="border-t border-zinc-800/30 bg-black/50 py-12" role="contentinfo">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 font-bold text-sm text-white tracking-tight">
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs shadow-lg"
            style={{ background: `linear-gradient(to tr, ${color}, ${accent})`, boxShadow: `${color}26 0 4px 12px` }}
          >
            {config?.icon ?? '◇'}
          </span>
          {config?.tagline ?? 'GPU Revolution'}
        </div>
        <p className="text-xs text-zinc-600">
          {vendor
            ? `${config?.label ?? ''} — a 3D scrollytelling journey.`
            : 'A 3D scrollytelling journey through processor history.'}
        </p>
        {vendor && (
          <button
            onClick={() => setVendor(vendor)}
            className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            aria-label="Switch vendor"
          >
            Explore other vendors
          </button>
        )}
      </div>
    </footer>
  )
}
