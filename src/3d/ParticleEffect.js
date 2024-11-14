import { Points, PointMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { Physics, usePlane, useBox } from '@react-three/cannon'

export default function ParticleEffect({
  gather = false,
  continuousRotation,
  heartbeatIntensity,
  minDistance,
  burst,
  scale,
  currentSection,
}) {
  const pointsRef = useRef()
  const color = new THREE.Color('#1a2ffb')
  const particleCount = 10000
  const positions = new Float32Array(particleCount * 3)
  const originalPositions = []

  // Initialize particle positions
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

  useFrame(() => {
    if (pointsRef.current) {
      if (continuousRotation) pointsRef.current.rotation.y += 0.001

      const positions = pointsRef.current.geometry.attributes.position.array

      for (let i = 0; i < particleCount; i++) {
        const index = i * 3
        const targetX = gather ? 0 : originalPositions[i].x
        const targetY = gather ? 0 : originalPositions[i].y
        const targetZ = gather ? 0 : originalPositions[i].z

        // Gathering effect
        const gatheringSpeed = 0.03
        positions[index] += (targetX - positions[index]) * gatheringSpeed
        positions[index + 1] += (targetY - positions[index + 1]) * gatheringSpeed
        positions[index + 2] += (targetZ - positions[index + 2]) * gatheringSpeed

        // Maintain minimum distance when gathering
        if (gather) {
          const distance = Math.sqrt(positions[index] ** 2 + positions[index + 1] ** 2 + positions[index + 2] ** 2)
          if (distance < minDistance) {
            positions[index] *= minDistance / distance
            positions[index + 1] *= minDistance / distance
            positions[index + 2] *= minDistance / distance
          }
        }

        // Heartbeat effect for Sections 7 and 8
        if (currentSection === 7 || currentSection === 8) {
          const heartbeatScale = 1 + Math.sin(Date.now() * 0.004) * (heartbeatIntensity + 0.3)
          positions[index] *= heartbeatScale
          positions[index + 1] *= heartbeatScale
          positions[index + 2] *= heartbeatScale
        }

        // Gravity effect in Section 9
        if (currentSection === 9) {
          // Apply gravity-like effect
          positions[index + 1] -= 0.3 // Simulate gravity effect to make particles fall

          // Ensure particles stop at floor level (-50)
          if (positions[index + 1] < -50) {
            positions[index + 1] = -50 // Settle particles at the floor
            positions[index] += (Math.random() - 0.5) * 0.2 // Small horizontal spread on x-axis after landing
            positions[index + 2] += (Math.random() - 0.5) * 0.2 // Small horizontal spread on z-axis after landing
          }
        }

        // Breaking apart effect in Section 10

        if (currentSection === 10) {
          positions[index] += (Math.random() - 0.5) * 3
          positions[index + 1] += (Math.random() - 0.5) * 3
          positions[index + 2] += (Math.random() - 0.5) * 3
        }

        if (currentSection === 11) {
          // Burst effect
          positions[index] += (Math.random() - 0.5) * 5
          positions[index + 1] += (Math.random() - 0.5) * 5
          positions[index + 2] += (Math.random() - 0.5) * 5
        }
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <Physics>
      <pointLight position={[15, 20, 15]} intensity={1} color='white' />
      <pointLight position={[-15, -10, -10]} intensity={0.5} color='#ff4d4d' />
      <pointLight position={[10, -20, 10]} intensity={0.3} color='#4d94ff' />

      <Points ref={pointsRef} positions={positions} stride={3} scale={scale}>
        <PointMaterial
          color={color}
          size={0.1}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.9}
          transparent
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </Physics>
  )
}
