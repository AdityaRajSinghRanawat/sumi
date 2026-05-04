import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Hook to initialize Lenis smooth scrolling on the page
 */
export const useLenisScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])
}

/**
 * Component wrapper for Lenis initialization
 */
const LenisWrapper = ({ children }) => {
  useLenisScroll()

  return <>{children}</>
}

export default LenisWrapper
