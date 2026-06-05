import type { RefObject } from 'react'
import type { Group } from 'three'
import GPUDie from '../GPUDie'
import CircuitBoard from '../CircuitBoard'
import NVLinkRack from '../NVLinkRack'

export default function NvidiaScene({
  dieRef,
  scrollRef,
}: {
  dieRef: RefObject<Group | null>
  scrollRef: RefObject<number>
}) {
  return (
    <>
      <GPUDie groupRef={dieRef} />
      <CircuitBoard scrollRef={scrollRef} />
      <NVLinkRack scrollRef={scrollRef} />
    </>
  )
}
