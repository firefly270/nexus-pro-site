import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3, CatmullRomCurve3, MathUtils } from 'three'
import { useVendor } from '../context/VendorContext'
import { useBoundStore } from '../store/useBoundStore'
import { tickTransition, shouldSwapVendor } from './SceneTransition'

interface KfPt {
  x: number; y: number; z: number
  tx: number; ty: number; tz: number
}

const NVIDIA_KF: KfPt[] = [
  { x: 0, y: 0.5, z: 8, tx: 0, ty: 0, tz: 0 },
  { x: 4, y: 1.5, z: 3, tx: 0, ty: 0.2, tz: 0 },
  { x: -3, y: 0.8, z: 2.5, tx: 0, ty: 0, tz: 0 },
  { x: 0, y: -0.5, z: 5, tx: 0, ty: 0, tz: 0 },
  { x: -4, y: 0.3, z: 4, tx: 0, ty: 0, tz: 0 },
  { x: 2, y: 0, z: 3, tx: 0, ty: 0.5, tz: 0 },
  { x: 3, y: 1.2, z: 5, tx: 0, ty: 0, tz: 0 },
  { x: -2, y: 0.8, z: 14, tx: 0.5, ty: 0.2, tz: 0 },
  { x: 0, y: 0, z: 15, tx: 0, ty: 0, tz: 0 },
]

const AMD_KF: KfPt[] = [
  { x: 0, y: 0.2, z: 9, tx: 0, ty: 0, tz: 0 },
  { x: 3, y: 1, z: 4, tx: 0, ty: 0.2, tz: 0 },
  { x: -2.5, y: 0.8, z: 3, tx: 0, ty: 0, tz: 0 },
  { x: 0, y: -0.3, z: 5, tx: 0, ty: 0, tz: 0 },
  { x: -3, y: 0.5, z: 4.5, tx: 0, ty: 0, tz: 0 },
  { x: 2, y: 0.4, z: 4, tx: 0, ty: 0.3, tz: 0 },
  { x: 0, y: 0, z: 14, tx: 0, ty: 0, tz: 0 },
]

const INTEL_KF: KfPt[] = [
  { x: 0, y: 0.3, z: 10, tx: 0, ty: 0, tz: 0 },
  { x: 3.5, y: 1, z: 4.5, tx: 0, ty: 0.2, tz: 0 },
  { x: -3, y: 0.5, z: 3, tx: 0, ty: 0, tz: 0 },
  { x: 0, y: 0.7, z: 5, tx: 0, ty: 0, tz: 0 },
  { x: 2.5, y: -0.3, z: 4, tx: 0, ty: 0, tz: 0 },
  { x: -2, y: 0.5, z: 4.5, tx: 0, ty: 0.3, tz: 0 },
  { x: 0, y: 0, z: 15, tx: 0, ty: 0, tz: 0 },
]

const KF_MAP: Record<string, KfPt[]> = {
  nvidia: NVIDIA_KF,
  amd: AMD_KF,
  intel: INTEL_KF,
}

export default function CameraSpline() {
  const { camera } = useThree()
  const { vendor } = useVendor()
  const currentPos = useRef(new Vector3())
  const currentTarget = useRef(new Vector3())
  const tempPos = useRef(new Vector3())
  const tempTarget = useRef(new Vector3())
  const swapped = useRef(false)

  const splines = useMemo(() => {
    const pts = KF_MAP[vendor ?? 'nvidia'] ?? NVIDIA_KF
    const pos = pts.map(p => new Vector3(p.x, p.y, p.z))
    const tgt = pts.map(p => new Vector3(p.tx, p.ty, p.tz))
    return {
      posSpline: new CatmullRomCurve3(pos, false, 'centripetal'),
      tgtSpline: new CatmullRomCurve3(tgt, false, 'centripetal'),
    }
  }, [vendor])

  useFrame((_, delta) => {
    const store = useBoundStore.getState()
    const trans = store.transition
    let t = store.transient.scrollProgress
    let lerpSpeed = 4

    if (trans.phase !== 'idle') {
      const updated = tickTransition(trans, delta)
      if (updated !== trans) {
        useBoundStore.getState().updateTransition(updated)
      }
      t = trans.progress * 0.3
      lerpSpeed = 8

      if (shouldSwapVendor(updated) && !swapped.current) {
        if (trans.toVendor) {
          store.setVendor(trans.toVendor)
        }
        swapped.current = true
      }
      if (updated.phase === 'idle') {
        swapped.current = false
      }
    }

    const clamped = MathUtils.clamp(t, 0, 1)
    splines.posSpline.getPointAt(clamped, tempPos.current)
    splines.tgtSpline.getPointAt(clamped, tempTarget.current)

    currentPos.current.lerp(tempPos.current, delta * lerpSpeed)
    currentTarget.current.lerp(tempTarget.current, delta * lerpSpeed)

    camera.position.copy(currentPos.current)
    camera.lookAt(currentTarget.current)
  })

  return null
}
