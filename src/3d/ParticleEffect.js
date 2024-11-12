import { Points, PointMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

export default function ParticleEffect({ gather = false }) {
  const pointsRef = useRef()
  const color = new THREE.Color('#1a2ffb') // Neon blue color

  // Create random positions and sizes for particles
  const particleCount = 10000
  const positions = new Float32Array(particleCount * 3)
  const originalPositions = []

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

    // Store the original positions for easy reset
    originalPositions.push({ x, y, z })
  }

  // Update particles for floating effect and gathering animation
  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001

      const positions = pointsRef.current.geometry.attributes.position.array

      for (let i = 0; i < particleCount; i++) {
        const index = i * 3
        const targetX = gather ? 0 : originalPositions[i].x
        const targetY = gather ? 0 : originalPositions[i].y
        const targetZ = gather ? 0 : originalPositions[i].z

        // Increase gathering speed by using 0.05 instead of 0.02
        const gatheringSpeed = 0.08

        positions[index] += (targetX - positions[index]) * gatheringSpeed
        positions[index + 1] += (targetY - positions[index + 1]) * gatheringSpeed
        positions[index + 2] += (targetZ - positions[index + 2]) * gatheringSpeed

        // Maintain a minimum distance from the center when gathering
        if (gather) {
          const minDistance = 4
          const distance = Math.sqrt(positions[index] ** 2 + positions[index + 1] ** 2 + positions[index + 2] ** 2)
          if (distance < minDistance) {
            positions[index] *= minDistance / distance
            positions[index + 1] *= minDistance / distance
            positions[index + 2] *= minDistance / distance
          }
        }
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <>
      {/* Multiple Light Sources for depth */}
      <pointLight position={[15, 20, 15]} intensity={1} color='white' />
      <pointLight position={[-15, -10, -10]} intensity={0.5} color='#ff4d4d' />
      <pointLight position={[10, -20, 10]} intensity={0.3} color='#4d94ff' />

      <Points ref={pointsRef} positions={positions} stride={3}>
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
    </>
  )
}
