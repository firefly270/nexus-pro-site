import { lazy, Suspense } from 'react'
import type { CardData } from '../types'

const GPUCard = lazy(() => import('./GPUCard'))

interface BentoGridProps {
  cards: CardData[] | undefined
}

const layouts: Record<number, string[]> = {
  1: ['full'],
  2: ['full', 'hero'],
  3: ['full', 'hero', 'compact'],
  4: ['full', 'hero', 'compact', 'hero'],
  5: ['full', 'hero', 'compact', 'hero', 'compact'],
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl p-4 w-full animate-pulse" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-1.5">
          <div className="h-4 w-28 bg-zinc-800 rounded" />
          <div className="h-3 w-20 bg-zinc-800/50 rounded" />
        </div>
        <div className="h-4 w-24 bg-zinc-800 rounded" />
      </div>
      <div className="h-3 w-full bg-zinc-800/50 rounded mb-4" />
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="h-14 bg-zinc-800/30 rounded-lg" />
        <div className="h-14 bg-zinc-800/30 rounded-lg" />
      </div>
      <div className="flex gap-1.5">
        <div className="h-4 w-12 bg-zinc-800/40 rounded-full" />
        <div className="h-4 w-16 bg-zinc-800/40 rounded-full" />
        <div className="h-4 w-10 bg-zinc-800/40 rounded-full" />
      </div>
    </div>
  )
}

export default function BentoGrid({ cards }: BentoGridProps) {
  if (!cards || cards.length === 0) return null
  const layout = layouts[cards.length] ?? cards.map(() => 'compact')

  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-full" style={{ gap: 'var(--era-grid-gap, 16px)' }}>
      {cards.map((card, i) => {
        const role = layout[i] ?? 'compact'
        return (
          <div
            key={card.name}
            className={`${role === 'full' ? 'lg:col-span-3' : role === 'hero' ? 'lg:col-span-2' : 'lg:col-span-1'} transition-all duration-300 ease-out`}
          >
            <Suspense fallback={<CardSkeleton />}>
              <GPUCard {...card} bentoRole={role as 'hero' | 'compact' | 'full'} />
            </Suspense>
          </div>
        )
      })}
    </div>
  )
}