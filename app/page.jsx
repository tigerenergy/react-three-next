'use client'

import React, { Suspense, useEffect, useState, useRef } from 'react'
import { motion, useTransform, useScroll } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { useThree } from '@react-three/fiber'
import { ChevronDown } from 'lucide-react'
import ParticleEffect from '../src/3d/ParticleEffect'
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing'
import { Physics } from '@react-three/cannon'

export default function Page() {
  const [isClient, setIsClient] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const previousSectionRef = useRef(0)
  const sectionsRef = useRef([...Array(14)].map(() => React.createRef()))

  useEffect(() => {
    setIsClient(true)
  }, [])

  const { scrollY } = useScroll()
  const logoOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const logoScale = useTransform(scrollY, [0, 300], [1, 2])
  const lineVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut', staggerChildren: 0.3 } },
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionIndex = sectionsRef.current.findIndex((ref) => ref.current === entry.target)
            if (sectionIndex !== -1) {
              previousSectionRef.current = currentSection // Track previous section
              setCurrentSection(sectionIndex + 1)
            }
          }
        })
      },
      { threshold: 0.6 },
    )

    sectionsRef.current.forEach((ref) => {
      if (ref.current) observer.observe(ref.current)
    })

    return () => {
      sectionsRef.current.forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current)
      })
    }
  }, [currentSection])

  return (
    <div className='relative w-full min-h-screen overflow-hidden text-white bg-black'>
      {isClient && currentSection <= 12 && (
        <motion.div
          style={{ opacity: logoOpacity }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className='absolute inset-0 z-0'
        >
          <Suspense fallback={null}>
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
              <ambientLight intensity={0.5} />
              <Physics gravity={[0, -9.8, 0]}>
                <DynamicParticleEffect currentSection={currentSection} />
              </Physics>
              <EffectComposer>
                <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} intensity={1.5} />
                <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
              </EffectComposer>
            </Canvas>
          </Suspense>
        </motion.div>
      )}

      <div className='h-screen overflow-y-scroll snap-y snap-mandatory'>
        <section
          className='relative flex items-center justify-center min-h-screen snap-center'
          ref={sectionsRef.current[0]}
        >
          <motion.div
            style={{ opacity: logoOpacity, scale: logoScale }}
            className='absolute inset-0 z-10 flex flex-col items-center justify-center'
          >
            <img src='/logo-white.svg' alt='CNDF Logo' className='w-[10rem] sm:w-[15rem] md:w-[20rem] lg:w-[25rem]' />
          </motion.div>
          <motion.div
            style={{ opacity: logoOpacity, scale: logoScale }}
            className='absolute flex items-center justify-center w-full bottom-8'
          >
            <div className='flex flex-col items-center text-lg font-bold tracking-wide uppercase'>
              <span>Scroll to Explore</span>
              <ChevronDown className='w-6 h-6 mt-2 text-white animate-bounce' />
            </div>
          </motion.div>
        </section>

        {Array.from({ length: 10 }, (_, index) => (
          <section
            key={index + 1}
            className='relative flex items-center justify-center min-h-screen snap-center'
            ref={sectionsRef.current[index + 1]}
          >
            <motion.div initial='hidden' whileInView='visible' variants={lineVariants} className='text-center'>
              <motion.h2
                className='text-4xl font-bold uppercase sm:text-5xl md:text-6xl lg:text-7xl'
                variants={lineVariants}
              >
                {`Section ${index + 2} Heading`}
              </motion.h2>
              <motion.p className='mt-4 text-xl uppercase sm:text-2xl md:text-3xl lg:text-4xl' variants={lineVariants}>
                {`Section ${index + 2} description text goes here.`}
              </motion.p>
            </motion.div>
          </section>
        ))}

        <section
          className='relative flex items-center justify-center min-h-screen snap-center'
          ref={sectionsRef.current[11]}
        >
          <motion.div initial='hidden' whileInView='visible' variants={lineVariants} className='text-center'>
            <motion.h2 className='text-4xl font-bold uppercase md:text-6xl lg:text-7xl' variants={lineVariants}>
              AMP Advanced for Multi Platform
            </motion.h2>
          </motion.div>
        </section>
        <section
          className='relative flex items-center justify-center min-h-screen snap-center'
          ref={sectionsRef.current[12]}
        >
          <motion.div initial='hidden' whileInView='visible' variants={lineVariants} className='text-center'>
            <motion.h2
              className='text-4xl font-bold uppercase sm:text-5xl md:text-6xl lg:text-7xl'
              variants={lineVariants}
            >
              AMP는 Advanced for Multi Platform의 약자로,
            </motion.h2>
            <motion.p className='mt-4 text-xl uppercase sm:text-2xl md:text-3xl lg:text-4xl' variants={lineVariants}>
              모바일 및 Web 2.0 에 걸맞는 웹 호환성 개발을 위한
            </motion.p>
          </motion.div>
        </section>
        <section
          className='relative flex items-center justify-center min-h-screen snap-center'
          ref={sectionsRef.current[13]}
        >
          <motion.div initial='hidden' whileInView='visible' variants={lineVariants} className='text-center'>
            <motion.h2
              className='text-4xl font-bold uppercase sm:text-5xl md:text-6xl lg:text-7xl'
              variants={lineVariants}
            >
              NEXT
            </motion.h2>
            <motion.p className='mt-4 text-xl uppercase sm:text-2xl md:text-3xl lg:text-4xl' variants={lineVariants}>
              NEXT
            </motion.p>
          </motion.div>
        </section>
      </div>
    </div>
  )
}

function DynamicParticleEffect({ currentSection }) {
  const { camera } = useThree()
  const [particleScale, setParticleScale] = useState(1)

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768
      setParticleScale(isMobile ? 0.5 : 1)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const fovMap = {
      1: 1,
      2: 50,
      3: 100,
      4: 150,
      5: 200,
      6: 300,
      7: 300,
      8: 300,
      9: 300,
      10: 300,
      11: 300,
      12: -150,
    }

    camera.fov = fovMap[currentSection] || 60
    camera.updateProjectionMatrix()
  }, [currentSection, camera])
  console.log(currentSection)
  // if (currentSection === 12) return null

  const continuousRotation = currentSection >= 1 && currentSection <= 5
  const heartbeatIntensity = currentSection >= 6 && currentSection < 11 ? Math.min(1, (currentSection - 5) * 0.25) : 0
  const burst = currentSection === 11

  return (
    <Physics gravity={[0, -9.8, 0]}>
      <ParticleEffect
        gather={currentSection >= 6 && currentSection < 11}
        continuousRotation={continuousRotation}
        heartbeatIntensity={heartbeatIntensity}
        minDistance={heartbeatIntensity > 0 ? 1 + (1 - heartbeatIntensity) * 3 : 4}
        burst={burst}
        scale={particleScale}
        currentSection={currentSection}
      />
    </Physics>
  )
}
