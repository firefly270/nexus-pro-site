import type { RefObject } from 'react'
import type { Group } from 'three'
import IntelMeshInterconnect from '../Intel_MeshInterconnect'

export default function IntelScene({ intelRef }: { intelRef: RefObject<Group | null> }) {
  return <IntelMeshInterconnect groupRef={intelRef} />
}
