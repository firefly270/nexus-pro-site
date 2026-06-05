import type { RefObject } from 'react'
import type { Group } from 'three'
import AMDChipletDie from '../AMD_ChipletDie'

export default function AmdScene({ amdRef }: { amdRef: RefObject<Group | null> }) {
  return <AMDChipletDie groupRef={amdRef} />
}
