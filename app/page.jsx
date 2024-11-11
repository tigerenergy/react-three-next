'use client'
import { Suspense, useEffect, useState } from 'react'
import { motion, useTransform, useScroll } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { ChevronDown } from 'lucide-react'
import ParticleEffect from '../src/3d/ParticleEffect'

export default function Page() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Framer Motion's useScroll to track scroll position
  const { scrollY } = useScroll()

  // Transformations for the first section
  const logoOpacity = useTransform(scrollY, [0, 300], [1, 0]) // Fades out
  const logoScale = useTransform(scrollY, [0, 300], [1, 2]) // Grows larger

  // Animation variants for line-by-line text appearance
  const lineVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut', staggerChildren: 0.3 } },
  }

  // Consistent font style class for all sections
  const headingClass = 'text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl'
  const paragraphClass = 'mt-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl'

  return (
    <div className='relative w-full min-h-screen overflow-hidden text-white bg-black'>
      {/* Particle Background */}
      {isClient && (
        <motion.div
          style={{ opacity: logoOpacity }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className='absolute inset-0 z-0'
        >
          <Suspense fallback={null}>
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
              <ambientLight intensity={0.5} />
              <ParticleEffect />
            </Canvas>
          </Suspense>
        </motion.div>
      )}

      {/* First Full-Screen Section with Logo */}
      <section className='relative flex items-center justify-center min-h-screen'>
        {/* Logo */}
        <motion.div
          style={{ opacity: logoOpacity, scale: logoScale }}
          className='absolute inset-0 z-10 flex flex-col items-center justify-center'
        >
          <img src='/logo-white.svg' alt='CNDF Logo' className='w-[10rem] sm:w-[15rem] md:w-[20rem] lg:w-[25rem]' />
        </motion.div>

        {/* Scroll Instruction */}
        <motion.div
          style={{ opacity: logoOpacity, scale: logoScale }}
          className='absolute flex items-center justify-center w-full bottom-8'
        >
          <div className='flex flex-col items-center text-lg font-bold tracking-wide uppercase'>
            <span>Scroll to Explore</span>
            <ChevronDown className='w-6 h-6 mt-2 text-lime-400 animate-bounce' />
          </div>
        </motion.div>
      </section>

      {/* Text Sections with Line-by-Line Animation */}
      <section className='relative flex items-center justify-center min-h-screen uppercase'>
        <motion.div initial='hidden' whileInView='visible' variants={lineVariants} className='text-center'>
          <motion.h2 className={headingClass} variants={lineVariants}>
            We provide
          </motion.h2>
          <motion.p className={paragraphClass} variants={lineVariants}>
            creative different solutions.
          </motion.p>
        </motion.div>
      </section>

      {/* Additional Full-Screen Text Sections with Consistent Font Sizes */}
      <section className='relative flex items-center justify-center min-h-screen'>
        <motion.div initial='hidden' whileInView='visible' variants={lineVariants} className='text-center'>
          <motion.h2 className={headingClass} variants={lineVariants}>
            고객에게 필요한 시스템의 통합적인 솔루션 제공
          </motion.h2>
          <motion.p className={paragraphClass} variants={lineVariants}>
            고객에게 필요한 시스템의 컨설팅부터 운용까지 통합적인 솔루션을 제공합니다.
          </motion.p>
        </motion.div>
      </section>

      <section className='relative flex items-center justify-center min-h-screen'>
        <motion.div initial='hidden' whileInView='visible' variants={lineVariants} className='text-center'>
          <motion.h2 className={headingClass} variants={lineVariants}>
            다양한 마케팅 프로젝트 수행
          </motion.h2>
          <motion.p className={paragraphClass} variants={lineVariants}>
            스마트폰 어플리케이션을 활용한 다양한 마케팅 프로젝트를 수행하고 있습니다.
          </motion.p>
        </motion.div>
      </section>

      <section className='relative flex items-center justify-center min-h-screen'>
        <motion.div initial='hidden' whileInView='visible' variants={lineVariants} className='text-center'>
          <motion.h2 className={headingClass} variants={lineVariants}>
            기업과 소비자 모두의 폭넓은 만족
          </motion.h2>
          <motion.p className={paragraphClass} variants={lineVariants}>
            그동안 축적된 스마트폰 어플리케이션 운영 기술과 마케팅 전략을 통해 기업과 소비자 모두에게 만족을
            드리겠습니다.
          </motion.p>
        </motion.div>
      </section>
    </div>
  )
}
