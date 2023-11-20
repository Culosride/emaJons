import { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"

const useMeasureRef = (currentSlide) => {
  const [width, setWidth] = useState(0)
  const isFullscreen = useSelector(state => state.ui.isFullscreen)

  const refCallback = useCallback((node) => {
    if(node) {
      const slideWidth = node?.firstChild.getBoundingClientRect().width
      const translation = slideWidth * currentSlide
      setWidth(translation)
    }
  }, [currentSlide, isFullscreen])

  return { width, refCallback }
}

export default useMeasureRef;
