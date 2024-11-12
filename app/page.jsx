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

  // Use a single ref to store references for all sections
  const sectionsRef = useRef([])

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
            const sectionIndex = sectionsRef.current.findIndex((ref) => ref === entry.target)
            setCurrentSection(sectionIndex + 1)
          }
        })
      },
      { threshold: 0.6 },
    )

    sectionsRef.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      sectionsRef.current.forEach((ref) => {
        if (ref) observer.unobserve(ref)
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
        <section className='relative flex items-center justify-center min-h-screen snap-center' ref={sectionsRef[0]}>
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
        <section
          className='relative flex items-center justify-center min-h-screen uppercase snap-center'
          ref={sectionsRef[1]}
        >
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
        <section className='relative flex items-center justify-center min-h-screen snap-center' ref={sectionsRef[2]}>
          <motion.div initial='hidden' whileInView='visible' variants={lineVariants} className='text-center'>
            <motion.h2 className={headingClass} variants={lineVariants}>
              고객에게 필요한 시스템의 통합적인 솔루션 제공
            </motion.h2>
            <motion.p className={paragraphClass} variants={lineVariants}>
              고객에게 필요한 시스템의 컨설팅부터 운용까지 통합적인 솔루션을 제공합니다.
            </motion.p>
          </motion.div>
        </section>

        <section
          className='relative flex items-center justify-center min-h-screen uppercase snap-center'
          ref={sectionsRef[3]}
        >
          <motion.div initial='hidden' whileInView='visible' variants={lineVariants} className='text-center'>
            <motion.h2 className={headingClass} variants={lineVariants}>
              다양한 마케팅 프로젝트 수행
            </motion.h2>
            <motion.p className={paragraphClass} variants={lineVariants}>
              스마트폰 어플리케이션을 활용한 다양한 마케팅 프로젝트를 수행하고 있습니다.
            </motion.p>
          </motion.div>
        </section>

        <section className='relative flex items-center justify-center min-h-screen snap-center' ref={sectionsRef[4]}>
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

        {/* New Section: Project Direction */}
        <section className='relative flex items-center justify-center min-h-screen snap-center' ref={sectionsRef[5]}>
          <motion.div initial='hidden' whileInView='visible' variants={lineVariants} className='text-center'>
            <motion.h2 className={headingClass} variants={lineVariants}>
              Project Direction
            </motion.h2>
            <motion.p className={paragraphClass} variants={lineVariants}>
              프로젝트 방향성
            </motion.p>
          </motion.div>
        </section>

        {/* Additional Sections */}
        <section className='relative flex items-center justify-center min-h-screen snap-center' ref={sectionsRef[6]}>
          <motion.div initial='hidden' whileInView='visible' variants={lineVariants} className='text-center'>
            <motion.h2 className={headingClass} variants={lineVariants}>
              개발
            </motion.h2>
            <motion.h3 className={paragraphClass} variants={lineVariants}>
              development
            </motion.h3>
            <motion.p className={paragraphClass} variants={lineVariants}>
              CNDF만의 독자적 플랫폼을 통한 빠르고 정확한 개발(One Source Multi Use) 자체 플랫폼 사용으로 유지보수 용이
            </motion.p>
          </motion.div>
        </section>

        <section className='relative flex items-center justify-center min-h-screen snap-center' ref={sectionsRef[7]}>
          <motion.div initial='hidden' whileInView='visible' variants={lineVariants} className='text-center'>
            <motion.h2 className={headingClass} variants={lineVariants}>
              운영
            </motion.h2>
            <motion.h3 className={paragraphClass} variants={lineVariants}>
              operation
            </motion.h3>
            <motion.p className={paragraphClass} variants={lineVariants}>
              고객사의 Pop-up 디자인 변경 등 S/W 업데이트 및 운영의 빠른 대응 (고객 요구 T+1 이내 피드백 및 계획수립)
            </motion.p>
          </motion.div>
        </section>

        <section className='relative flex items-center justify-center min-h-screen snap-center' ref={sectionsRef[8]}>
          <motion.div initial='hidden' whileInView='visible' variants={lineVariants} className='text-center'>
            <motion.h2 className={headingClass} variants={lineVariants}>
              마케팅
            </motion.h2>
            <motion.h3 className={paragraphClass} variants={lineVariants}>
              marketing
            </motion.h3>
            <motion.p className={paragraphClass} variants={lineVariants}>
              연 2회 이상 Major Update, 해당 시스템에 해당하는 배포 전략 및 시장 현황에 맞는 바이럴 마케팅/SNS 마케팅 등
            </motion.p>
          </motion.div>
        </section>

        <section className='relative flex items-center justify-center min-h-screen snap-center' ref={sectionsRef[9]}>
          <motion.div initial='hidden' whileInView='visible' variants={lineVariants} className='text-center'>
            <motion.h2 className={headingClass} variants={lineVariants}>
              하드웨어
            </motion.h2>
            <motion.h3 className={paragraphClass} variants={lineVariants}>
              hardware
            </motion.h3>
            <motion.p className={paragraphClass} variants={lineVariants}>
              Co-Location이 아닌 CNDF만의 단독 호스팅을 통한 서버 및 하드웨어 유지보수를 통해 비용 절감 및 보안성
              확보(ISP 통합 관제)와 하드웨어 장애 시 (M+20 이내) 장애대응 및 복구
            </motion.p>
          </motion.div>
        </section>

        <section className='relative flex items-center justify-center min-h-screen snap-center' ref={sectionsRef[10]}>
          <motion.div initial='hidden' whileInView='visible' variants={lineVariants} className='text-center'>
            <motion.h2 className={headingClass} variants={lineVariants}>
              대고객 서비스
            </motion.h2>
            <motion.h3 className={paragraphClass} variants={lineVariants}>
              customized service
            </motion.h3>
            <motion.p className={paragraphClass} variants={lineVariants}>
              CNDF만의 유지보수 방법론을 통한 대고객 서비스 운영
            </motion.p>
          </motion.div>
        </section>
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

  // Set effect parameters based on section
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
