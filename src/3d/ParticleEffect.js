import { Points, PointMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three'

export default function ParticleEffect({
  gather = false,
  continuousRotation = false,
  heartbeatIntensity = 0,
  minDistance = 4,
  burst = false,
}) {
  const pointsRef = useRef()
  const baseColor = new THREE.Color('#1a2ffb') // Initial blue color
  const particleCount = 10000
  const positions = new Float32Array(particleCount * 3)
  const originalPositions = []
  const [hasBurst, setHasBurst] = useState(false) // Track if burst has occurred

  for (let i = 0; i < particleCount; i++) {
    const radius = (Math.random() - 0.5) * 100
    const theta = Math.random() * 2 * Math.PI
    const phi = Math.acos(Math.random() * 2 - 1)

    const x = radius * Math.sin(phi) * Math.cos(theta)
    const y = radius * Math.sin(phi) * Math.sin(theta)
    const z = radius * Math.cos(phi)

    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z

    originalPositions.push({ x, y, z }) // Store the original positions for easy reset
  }

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array

      // Continuous rotation for sections 1-5
      if (continuousRotation && !burst) {
        pointsRef.current.rotation.y += 0.001
      }

      // Heartbeat effect for sections 6-10, disabled in section 11
      if (heartbeatIntensity > 0 && !burst) {
        const scale = 1 + Math.sin(clock.getElapsedTime() * 6) * heartbeatIntensity
        pointsRef.current.scale.set(scale, scale, scale)
      } else {
        pointsRef.current.scale.set(1, 1, 1)
      }

      // One-time burst effect for section 11
      if (burst && !hasBurst) {
        for (let i = 0; i < particleCount; i++) {
          const index = i * 3
          positions[index] += (Math.random() - 0.5) * 3 // Strong spread on x-axis
          positions[index + 1] -= Math.random() * 5 // Strong downward movement
          positions[index + 2] += (Math.random() - 0.5) * 3 // Strong spread on z-axis
        }
        setHasBurst(true) // Mark burst as completed
      } else if (burst && hasBurst) {
        // Make particles continue falling down after the burst
        for (let i = 0; i < particleCount; i++) {
          const index = i * 3
          positions[index + 1] -= 0.1 // Gradual downward movement
        }
      } else if (!burst) {
        // Normal particle movement with gathering effect if not bursting
        for (let i = 0; i < particleCount; i++) {
          const index = i * 3
          const targetX = gather ? 0 : originalPositions[i].x
          const targetY = gather ? 0 : originalPositions[i].y
          const targetZ = gather ? 0 : originalPositions[i].z

          const gatheringSpeed = 0.05

          positions[index] += (targetX - positions[index]) * gatheringSpeed
          positions[index + 1] += (targetY - positions[index + 1]) * gatheringSpeed
          positions[index + 2] += (targetZ - positions[index + 2]) * gatheringSpeed

          if (gather) {
            const distance = Math.sqrt(positions[index] ** 2 + positions[index + 1] ** 2 + positions[index + 2] ** 2)
            if (distance < minDistance) {
              positions[index] *= minDistance / distance
              positions[index + 1] *= minDistance / distance
              positions[index + 2] *= minDistance / distance
            }
          }
        }
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <>
      <pointLight position={[15, 20, 15]} intensity={1} color='white' />
      <pointLight position={[-15, -10, -10]} intensity={0.5} color='#ff4d4d' />
      <pointLight position={[10, -20, 10]} intensity={0.3} color='#4d94ff' />

      <Points ref={pointsRef} positions={positions} stride={3}>
        <PointMaterial
          color={baseColor}
          size={0.1}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.9}
          transparent
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </>
  )
}
