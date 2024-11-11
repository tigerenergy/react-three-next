// src/3d/ParticleEffect.js
import { Points, PointMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

export default function ParticleEffect() {
  const pointsRef = useRef()
  const color = new THREE.Color('#AACF37') // Set the color to the bright blue from the image

  // Create random positions for particles
  const particleCount = 20000
  const positions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20
  }

  // Update particles for a floating and twinkling effect
  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001 // Rotate particles for a floating effect

      // Create a twinkling effect by adjusting opacity over time
      const time = clock.getElapsedTime()
      pointsRef.current.material.opacity = 0.5 + Math.sin(time * 3) * 0.5 // Opacity oscillates between 0 and 1
    }
  })

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color={color} // Set color to bright blue
        size={0.05} // Adjust size as needed
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  )
}
