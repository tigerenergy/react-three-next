// src/3d/ParticleEffect.js
import { Points, PointMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

export default function ParticleEffect() {
  const pointsRef = useRef()
  const color = new THREE.Color('#1a2ffb') // Neon blue color

  // Create random positions and sizes for particles
  const particleCount = 10000
  const positions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i++) {
    const radius = (Math.random() - 0.5) * 100
    const theta = Math.random() * 2 * Math.PI
    const phi = Math.acos(Math.random() * 2 - 1)

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)
  }

  // Update particles for floating effect
  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001
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
          sizeAttenuation={true} // Scales particles with distance
          depthWrite={false} // Disable depth writing to prevent overlap artifacts
          opacity={0.9} // Set to 0.9 for a softer look
          transparent
          blending={THREE.AdditiveBlending} // Soft glow effect
        />
      </Points>
    </>
  )
}
