'use client'
import { Canvas } from '@react-three/fiber'
import { Preload, PerspectiveCamera } from '@react-three/drei'
import { r3f } from '@/helpers/global'
import * as THREE from 'three'

export default function Scene({ ...props }) {
  return (
    <Canvas
      {...props}
      onCreated={(state) => (state.gl.toneMapping = THREE.AgXToneMapping)}
      className='w-screen h-screen'
    >
      <PerspectiveCamera makeDefault fov={40} position={[0, 0, 20]} />
      <r3f.Out />
      <Preload all />
    </Canvas>
  )
}
