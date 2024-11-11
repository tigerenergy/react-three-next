// src/3d/ParticleEffect.js
import { Points, PointMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

export default function ParticleEffect() {
  const pointsRef = useRef()

  // Create random positions for particles
  const particleCount = 10000
  const positions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50
    positions[i * 3 + 10] = (Math.random() - 0.5) * 10
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20
  }

  // Update particles for a floating effect
  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001
    }
  })

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color='white'
        size={0.05} // Adjust the size for smaller, finer particles
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  )
}
