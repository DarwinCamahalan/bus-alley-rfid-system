import { useState, useEffect, useRef, useCallback } from 'react'

const StickyHeader = (defaultSticky = false) => {
  const [isSticky, setIsSticky] = useState(defaultSticky)
  const tableRef = useRef(null)

  const toggleStickiness = useCallback(
    ({ top, bottom }) => {
      if (top <= 0 && bottom > 2 * 68) {
        !isSticky && setIsSticky(true)
      } else {
        isSticky && setIsSticky(false)
      }
    },
    [isSticky]
  )

  useEffect(() => {
    const handleScroll = () => {
      toggleStickiness(tableRef.current.getBoundingClientRect())
    }
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [toggleStickiness])

  return { tableRef, isSticky }
}

export default StickyHeader
