'use client'

import { useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { HeroPoster, HeroPosterProps } from "@/components/hero-poster"
import GradientBlinds from "@/components/GradientBlinds"

interface ParallaxHeroProps extends HeroPosterProps {
  children: React.ReactNode;
  heroChildren?: React.ReactNode;
}

export default function ParallaxHero({ children, heroChildren, ...heroProps }: ParallaxHeroProps) {
  const { scrollY } = useScroll()
  const ref = useRef(null)
  const isInView = useInView(ref)

  const heroY = useTransform(scrollY, [0, 800], [0, 200])
  const heroOpacity = useTransform(scrollY, [0, 400, 800], [1, 1, 0])
  const contentY = useTransform(scrollY, [0, 800], [0, 0]) // Keep content in place initially

  return (
    <div className="relative bg-black">
      <motion.div
        ref={ref}
        className="fixed top-0 left-0 w-full h-dvh z-0"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <div className="absolute inset-0 z-0">
          <GradientBlinds
            gradientColors={['#393ADD', '#000000', '#1E1F8C']}
            blindCount={15}
            spotlightOpacity={0.3}
            noise={0.2}
            blindMinWidth={20}
            angle={10}
            mouseDampening={0.1}
            paused={!isInView}
          />
        </div>
        <div className="relative z-10 h-full">
          <HeroPoster {...heroProps} showImage={false}>
            {heroChildren}
          </HeroPoster>
        </div>
      </motion.div>

      <div className="relative z-10" style={{ marginTop: '100dvh' }}>
        <motion.div
          style={{ y: contentY }}
          className="bg-black rounded-t-3xl -mt-12 md:-mt-24 pt-12"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}
