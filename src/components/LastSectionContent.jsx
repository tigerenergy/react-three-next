// LastSectionContent.jsx
import React from 'react'
import { motion } from 'framer-motion'

export default function LastSectionContent() {
  const waveBackgroundVariants = {
    hidden: { opacity: 0, backgroundPosition: '200% 0%' },
    visible: {
      opacity: 0.9,
      backgroundPosition: '0% 0%',
      transition: { duration: 2, ease: 'easeInOut' },
    },
  }

  return (
    <section className='relative flex items-center justify-center min-h-screen text-center snap-center'>
      {/* Animated wave-like background */}
      <motion.div
        initial='hidden'
        whileInView='visible'
        variants={waveBackgroundVariants}
        style={{
          backgroundColor: '#1a2ffb',
          opacity: 0.9,
          backgroundImage: 'radial-gradient(circle, transparent, #1a2ffb)', // Wave effect
        }}
        className='absolute inset-0 z-[-1]'
      />

      {/* Text Content */}
      <div className='relative z-10 px-6'>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className='text-4xl font-bold uppercase md:text-6xl lg:text-7xl'
        >
          AMP Advanced for Multi Platform
        </motion.h2>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className='mt-4 text-2xl uppercase md:text-3xl lg:text-4xl'
        >
          AMP 이미지
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          className='mt-6 text-lg md:text-xl lg:text-2xl'
        >
          AMP는 Advanced for Multi Platform의 약자로, 모바일 및 Web 2.0 에 걸맞는 웹 호환성 개발을 위한 ㈜씨앤디팩토리의
          프레임워크입니다...
        </motion.p>
      </div>
    </section>
  )
}
