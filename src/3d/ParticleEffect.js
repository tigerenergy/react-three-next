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
  currentSection, // Add `currentSection` here
}) {
  const pointsRef = useRef()
  const baseColor = new THREE.Color('#1a2ffb')
  const particleCount = 10000
  const positions = new Float32Array(particleCount * 3)
  const originalPositions = []
  const [hasBurst, setHasBurst] = useState(false)

  // Generate initial positions for particles
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

    originalPositions.push({ x, y, z })
  }

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array

      // Continuous rotation for sections 1-5
      if (continuousRotation && !burst) {
        pointsRef.current.rotation.y += 0.001
      }

      // Heartbeat effect with gradual enlargement for sections 6-9
      if (heartbeatIntensity > 0 && !burst && currentSection >= 6 && currentSection <= 9) {
        const heartbeatSpeed = 6 + (currentSection - 6) * 2
        const scaleFactor = 1 + Math.sin(clock.getElapsedTime() * heartbeatSpeed) * (heartbeatIntensity * 0.2)
        pointsRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor)

        // Gradually increase minDistance from 4 to a larger value by section 9
        const dynamicMinDistance = minDistance + (currentSection - 6) * 2
        for (let i = 0; i < particleCount; i++) {
          const index = i * 3
          const distance = Math.sqrt(positions[index] ** 2 + positions[index + 1] ** 2 + positions[index + 2] ** 2)
          if (distance < dynamicMinDistance) {
            positions[index] *= dynamicMinDistance / distance
            positions[index + 1] *= dynamicMinDistance / distance
            positions[index + 2] *= dynamicMinDistance / distance
          }
        }
      }
      // Section 10: Spread particles across the screen
      else if (currentSection === 10 && !burst) {
        pointsRef.current.scale.set(3, 3, 3) // Larger scale for screen coverage
        for (let i = 0; i < particleCount; i++) {
          const index = i * 3
          positions[index] += (Math.random() - 0.5) * 10 // Strong spread on x-axis
          positions[index + 1] += (Math.random() - 0.5) * 10 // Strong spread on y-axis
          positions[index + 2] += (Math.random() - 0.5) * 10 // Strong spread on z-axis
        }
      }
      // Reset to default for other sections if not in burst
      else if (!burst) {
        pointsRef.current.scale.set(1, 1, 1)
      }

      // One-time burst effect for section 11
      if (burst && !hasBurst) {
        for (let i = 0; i < particleCount; i++) {
          const index = i * 3
          positions[index] += (Math.random() - 0.5) * 3
          positions[index + 1] -= Math.random() * 5
          positions[index + 2] += (Math.random() - 0.5) * 3
        }
        setHasBurst(true)
      } else if (burst && hasBurst) {
        for (let i = 0; i < particleCount; i++) {
          const index = i * 3
          positions[index + 1] -= 0.1
        }
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <>
      <pointLight position={[15, 20, 15]} intensity={2} color='white' />
      <pointLight position={[-15, -10, -10]} intensity={1} color='#ff4d4d' />
      <pointLight position={[10, -20, 10]} intensity={0.8} color='#4d94ff' />
      <Points ref={pointsRef} positions={positions} stride={3}>
        <PointMaterial
          color={baseColor}
          size={0.1}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={1}
          transparent
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </>
  )
}
