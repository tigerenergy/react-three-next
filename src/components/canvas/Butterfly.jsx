'use client'

import { useGLTF } from '@react-three/drei'
import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Butterfly(props) {
  const { scene, animations } = useGLTF('/flyingButterFly.glb')
  const mixer = useRef(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    if (animations.length > 0) {
      // Initialize AnimationMixer for wing-flapping animation
      mixer.current = new THREE.AnimationMixer(scene)
      const action = mixer.current.clipAction(animations[0])
      action.timeScale = 0.5
      action.play()
    }

    const onScroll = () => {
      setScrollY(window.scrollY * 0.01)
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [animations])

  useFrame((state, delta) => {
    if (mixer.current) mixer.current.update(delta)
    scene.position.z = -scrollY
  })

  // Apply hazy or blurred effect by adjusting material properties
  scene.traverse((object) => {
    if (object.isMesh) {
      object.material = new THREE.MeshStandardMaterial({
        map: object.material.map, // Use the same texture map
        transparent: true,
        opacity: 0.9, // Adjust opacity to make it hazy
        depthWrite: false,
        blending: THREE.AdditiveBlending, // Additive blending for a softer effect
      })
    }
  })

  return <primitive object={scene} {...props} />
}
