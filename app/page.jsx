'use client'

import { Suspense, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { ChevronDown } from 'lucide-react'
import ParticleEffect from '../src/3d/ParticleEffect'

export default function Page() {
  const [scrollY, setScrollY] = useState(0)

  // Handle scroll event to update scrollY state
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className='relative flex items-center justify-center min-h-screen overflow-hidden text-white bg-black'>
      {/* Header Section */}
      <div className='absolute z-10 flex items-center justify-between top-8 left-8 right-8'>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <img src='/logo.svg' alt='CNDF Logo' className='w-32 h-32 text-white' />
        </motion.div>
      </div>

      {/* Large Centered Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className='absolute inset-0 z-10 flex flex-col items-center justify-center'
      >
        <img src='/logo.svg' alt='CNDF Logo' className='text-white w-[30rem] md:w-[40rem]' />
        {/* Larger centered logo */}
      </motion.div>

      {/* Scroll Instruction */}
      <div className='absolute font-bold text-[2rem] tracking-wide uppercase bottom-12 right-12 flex items-center z-10'>
        <p className='relative group'>
          Scroll to Explore
          <div className='absolute top-0 transition-opacity duration-300 opacity-0 -right-8 group-hover:opacity-100'>
            <ChevronDown className='w-6 h-6 text-lime-400' />
          </div>
        </p>
      </div>

      {/* 3D Particle Background */}
      <div className='absolute inset-0 z-0'>
        <Suspense fallback={null}>
          <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
            <ambientLight intensity={0.5} />
            <ParticleEffect scrollY={scrollY} /> {/* Pass scrollY as prop */}
          </Canvas>
        </Suspense>
      </div>
    </div>
  )
}
