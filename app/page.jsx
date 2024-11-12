'use client'
import React, { Suspense, useEffect, useState, useRef } from 'react'
import { motion, useTransform, useScroll } from 'framer-motion'
import { Canvas, useThree } from '@react-three/fiber'
import { ChevronDown } from 'lucide-react'
import ParticleEffect from '../src/3d/ParticleEffect'
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing'

export default function Page() {
  const [isClient, setIsClient] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const sectionsRef = useRef([...Array(11)].map(() => React.createRef()))

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
    if (!sectionsRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionIndex = sectionsRef.current.findIndex((ref) => ref.current === entry.target)
            if (sectionIndex !== -1) setCurrentSection(sectionIndex + 1)
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
  }, [])

  const headingClass = 'text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl uppercase'
  const paragraphClass = 'mt-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl uppercase'

  return (
    <div className='relative w-full min-h-screen overflow-hidden text-white bg-black'>
      {isClient && (
        <motion.div
          style={{ opacity: logoOpacity }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className='absolute inset-0 z-0'
        >
          <Suspense fallback={null}>
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
              <ambientLight intensity={0.5} />
              <DynamicParticleEffect currentSection={currentSection} />
            </Canvas>
          </Suspense>
        </motion.div>
      )}

      {/* Scroll Container with Snap */}
      <div className='h-screen overflow-y-scroll snap-y snap-mandatory'>
        {/* First Full-Screen Section with Logo */}
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

        {/* Text Sections with Line-by-Line Animation */}
        {sectionsRef.current.slice(1).map((ref, index) => (
          <section
            key={index + 1}
            className='relative flex items-center justify-center min-h-screen uppercase snap-center'
            ref={ref}
          >
            <motion.div initial='hidden' whileInView='visible' variants={lineVariants} className='text-center'>
              <motion.h2 className={headingClass} variants={lineVariants}>
                {index === 0 ? 'We provide' : `Section ${index + 1}`}
              </motion.h2>
              <motion.p className={paragraphClass} variants={lineVariants}>
                {index === 0 ? 'creative different solutions.' : `Content for Section ${index + 1}`}
              </motion.p>
            </motion.div>
          </section>
        ))}
      </div>
    </div>
  )
}

function DynamicParticleEffect({ currentSection }) {
  const { camera } = useThree()

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
    }

    camera.fov = fovMap[currentSection] || 60
    camera.updateProjectionMatrix()
  }, [currentSection, camera])

  const continuousRotation = currentSection >= 1 && currentSection <= 5
  const heartbeatIntensity = currentSection >= 6 && currentSection < 11 ? Math.min(1, (currentSection - 5) * 0.25) : 0
  const burst = currentSection === 11

  return (
    <>
      <ParticleEffect
        gather={currentSection >= 6 && currentSection < 11}
        continuousRotation={continuousRotation}
        heartbeatIntensity={heartbeatIntensity}
        minDistance={heartbeatIntensity > 0 ? 1 + (1 - heartbeatIntensity) * 3 : 4}
        burst={burst}
      />
      <EffectComposer>
        <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} intensity={1.5} />
        <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
      </EffectComposer>
    </>
  )
}
