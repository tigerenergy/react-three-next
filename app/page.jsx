'use client'

import { Suspense, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { MoreHorizontal, ChevronDown, ArrowRight } from 'lucide-react'
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
          <h1 className='text-[3rem] font-bold'>CNDF</h1>
        </motion.div>

        <div className='flex items-center space-x-4'>
          <div className='flex items-center justify-center w-8 h-8 rounded-full bg-lime-400 animate-pulse'>
            <div className='w-4 h-4 bg-white rounded-full' />
          </div>
          <button className='flex items-center px-4 py-2 space-x-2 font-semibold text-white transition duration-300 transform bg-gray-800 rounded-full hover:bg-lime-400 hover:scale-105'>
            <ArrowRight />
            <span className='tracking-wide uppercase'>Let's Talk</span>
          </button>
          <button className='flex items-center px-4 py-2 font-semibold text-black transition duration-300 transform bg-gray-300 rounded-full hover:bg-lime-400 hover:scale-105'>
            <span className='tracking-wide uppercase'>Menu</span>
            <div className='ml-1 transition-transform duration-300 transform hover:rotate-90'>
              <MoreHorizontal />
            </div>
          </button>
        </div>
      </div>

      {/* Large Centered Text */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className='absolute inset-0 z-10 flex flex-col items-center justify-center'
      >
        <h1 className='text-[17rem] md:text-[25rem] font-bold leading-none tracking-tight'>CNDF</h1>
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
