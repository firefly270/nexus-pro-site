import type { CardData } from '../types'
import GPUCard from './GPUCard'

interface BentoGridProps {
  cards: CardData[] | undefined
}

const layouts: Record<number, string[]> = {
  1: ['full'],
  2: ['hero', 'compact'],
  3: ['hero', 'compact', 'full'],
  4: ['hero', 'compact', 'compact', 'full'],
  5: ['hero', 'compact', 'compact', 'full', 'compact'],
}

export default function BentoGrid({ cards }: BentoGridProps) {
  if (!cards || cards.length === 0) return null
  const layout = layouts[cards.length] ?? cards.map(() => 'compact')

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3" style={{ gap: 'var(--era-grid-gap, 16px)' }}>
      {cards.map((card, i) => {
        const role = layout[i] ?? 'compact'
        return (
          <div
            key={card.name}
            className={role === 'full' ? 'lg:col-span-3' : role === 'hero' ? 'lg:col-span-2' : 'lg:col-span-1'}
          >
            <GPUCard {...card} bentoRole={role as 'hero' | 'compact' | 'full'} />
          </div>
        )
      })}
    </div>
  )
}