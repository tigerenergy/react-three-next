import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function NeonTunnel() {
  const tunnelRef = useRef()

  // Generate positions for individual spheres as particles
  const particlesPositions = useMemo(() => {
    return Array.from({ length: 500 }).map(() => ({
      position: [
        (Math.random() - 0.5) * 60, // x position
        (Math.random() - 0.5) * 60, // y position
        -Math.random() * 200, // z position
      ],
    }))
  }, [])

  useFrame((state) => {
    const scrollOffset = state.clock.getElapsedTime() * 0.5
    if (tunnelRef.current) {
      tunnelRef.current.position.z = scrollOffset % 50
      tunnelRef.current.rotation.z += 0.002
    }
  })

  return (
    <group ref={tunnelRef}>
      {/* Lighting for shadows */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 10, 0]} intensity={1} castShadow />

      {/* Tunnel structure */}
      {Array.from({ length: 30 }).map((_, i) => (
        <mesh key={i} position={[0, 0, -i * 5]}>
          <boxGeometry args={[10, 10, 5]} />
          <meshStandardMaterial color={new THREE.Color('white')} wireframe transparent opacity={0.5} />
        </mesh>
      ))}

      {/* Star particles as small spheres with classy effects */}
      {particlesPositions.map((particle, index) => (
        <mesh key={index} position={particle.position} castShadow receiveShadow>
          <sphereGeometry args={[0.15, 16, 16]} /> {/* Slightly larger and smoother spheres */}
          <meshStandardMaterial
            color='#ffffff'
            emissive='#aaaaaa'
            emissiveIntensity={1.2} // Softer, classy glow
            roughness={0.1}
            metalness={0.3} // Metallic look for a high-quality effect
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
    </group>
  )
}
