// Page.js
'use client'
import { Canvas } from '@react-three/fiber'
import { Butterfly } from '../src/components/canvas/Butterfly' // Adjust the path as needed
import { NeonTunnel } from '../src/components/canvas/NeonTunnel' // Adjust the path as needed

export default function Page() {
  return (
    <Canvas style={{ background: 'black' }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <NeonTunnel />
      <Butterfly scale={5} position={[0, -1, 0]} />
    </Canvas>
  )
}
