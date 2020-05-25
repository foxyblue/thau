import { useState, useEffect } from 'react'

export default (ref: any, rootMargin: string = '0px') => {
  // State and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update our state when observer callback fires
        setIntersecting(entry.isIntersecting)
      },
      {
        rootMargin,
      }
    )

    const current = ref.current

    if (current) {
      observer.observe(current)
    }

    return () => {
      observer.unobserve(current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty array ensures that effect is only run on mount and unmount

  return isIntersecting
}
