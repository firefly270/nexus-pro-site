import { lazy, Suspense } from 'react'
import type { RefObject } from 'react'
import type { Group } from 'three'
import { useVendor } from '../context/VendorContext'

const NvidiaScene = lazy(() => import('./scenes/NvidiaScene'))
const AmdScene = lazy(() => import('./scenes/AmdScene'))
const IntelScene = lazy(() => import('./scenes/IntelScene'))

function SceneFallback() {
  return <group />
}

export function VendorScene(props: {
  dieRef: RefObject<Group | null>
  amdRef: RefObject<Group | null>
  intelRef: RefObject<Group | null>
  scrollRef: RefObject<number>
}) {
  const { vendor } = useVendor()

  if (vendor === 'nvidia') {
    return (
      <Suspense fallback={<SceneFallback />}>
        <NvidiaScene dieRef={props.dieRef} scrollRef={props.scrollRef} />
      </Suspense>
    )
  }
  if (vendor === 'amd') {
    return (
      <Suspense fallback={<SceneFallback />}>
        <AmdScene amdRef={props.amdRef} />
      </Suspense>
    )
  }
  if (vendor === 'intel') {
    return (
      <Suspense fallback={<SceneFallback />}>
        <IntelScene intelRef={props.intelRef} />
      </Suspense>
    )
  }
  return <SceneFallback />
}
