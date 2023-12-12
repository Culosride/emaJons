import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFullscreen } from "../../features/UI/uiSlice";
import useKeyPress from "../../hooks/useKeyPress";
import Button from "../UI/Button"

const Slider = ({ slides, cursorColor }) => {
  const dispatch = useDispatch()
  const screenSize = useSelector((state) => state.ui.screenSize);
  const isSingleSlide = slides.length === 1
  const infiniteSlides = isSingleSlide ? slides : [slides[slides.length -1], ...slides, slides[0]]

  const fullscreen = useSelector(state => state.ui.isFullscreen)
  const isFullscreen = fullscreen || Boolean(document.fullscreenElement)

  // slider state
  const [currentSlide, setCurrentSlide] = useState(isSingleSlide ? 0 : 1);
  const [translation, setTranslation] = useState(0)
  const [transition, setTransition] = useState("none")
  const [isTransitioning, setIsTransitioning] = useState(false);

  // touch events state
  const [isDragging, setIsDragging] = useState(false)
  const [startingPositionX, setStartingPositionX] = useState(0)
  const [startingPositionY, setStartingPositionY] = useState(0)
  const [deltaX, setDeltaX] = useState(0)
  const [deltaY, setDeltaY] = useState(0)

  // derived state
  const isVideo = infiniteSlides[currentSlide]?.mediaType === "video"
  const isLastSlide = currentSlide === infiniteSlides.length - 1
  const isFirstSlide = currentSlide === 0
  const currentDot = isLastSlide ? 0 : isFirstSlide ? slides.length - 1 : currentSlide - 1;
  document.body.style.overflowY = (deltaY === null) ? 'hidden' : "auto"

  const mediaRefs = slides.map(() => useRef(null)); // Create a ref for each video
  const observer = useRef(null);

  // useEffect(() => {

  //   const handleFullscreenChange = () => {
  //     if(document.fullscreenElement) {
  //       dispatch(toggleFullscreen(true))
  //     }
  //   }

  //   document.addEventListener("fullscreenchange", handleFullscreenChange);

  //   return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  // }, [])


  useEffect(() => {
    mediaRefs.forEach((ref, index) => {
      if (ref.current?.localName === "video" && index !== currentSlide) {
        ref.current.pause();
      }
    });

    if(document.fullscreenElement) {
      dispatch(toggleFullscreen(true))
    }

  }, [currentSlide, isFullscreen]);

  const calcTranslation = (node) => {
    if(node) {
      const slideWidth = node.firstChild.getBoundingClientRect().width
      const newTranslation = slideWidth * currentSlide
      setTranslation(newTranslation - deltaX)

      if (isLastSlide || isFirstSlide) {
        setTimeout(() => {
          setCurrentSlide(isLastSlide ? 1 : slides.length);
          setTransition("none");
        }, 250);
      }
    }
  }

  const draggableRef = useCallback(element => {
    if (isSingleSlide) return
    if (observer.current) observer.current.disconnect();

    observer.current = new ResizeObserver((entries) => {
      calcTranslation(entries[0].target)
    });

    if (element) observer.current.observe(element);
  }, [currentSlide])

  const draggableStyles = {
    transform: `translateX(-${translation - deltaX}px)`,
    transition: transition,
  }

  const handleNavigation = (direction) => {
    if (!isTransitioning) {
      setIsTransitioning(true);

      if(!isLastSlide || !isFirstSlide) {
        setTransition("transform 0.25s ease");
        setCurrentSlide((currentSlide + direction + infiniteSlides.length) % infiniteSlides.length);
      }

      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleNext = () => !isSingleSlide && handleNavigation(1);
  const handlePrev = () => !isSingleSlide && handleNavigation(-1);

  useKeyPress("ArrowRight", handleNext)
  useKeyPress("ArrowLeft", handlePrev)

  const handlePage = (page) => setCurrentSlide(page);

  const handleFullscreen = () => {
    setTransition("none")
    dispatch(toggleFullscreen());
  }

  //////////////////////////// --- touch events --- ////////////////////////////
  const handleTouchStart = (e) => {
    if(isSingleSlide) return

    setStartingPositionX(e.touches[0].clientX)
    setStartingPositionY(e.touches[0].clientY)

    setIsDragging(true)
    setTransition("none")
  };

  const handleTouchMove = (e) => {
    if(!isDragging || isSingleSlide) return

    if(document.fullscreenElement) {
      document.exitFullscreen();
    }

    const currentPositionX = e.touches[0].clientX;
    const currentPositionY = e.touches[0].clientY;

    const verticalDelta = currentPositionY - startingPositionY;
    const horizontalDelta = currentPositionX - startingPositionX;

    // after first time this has run, if swiping in one direction, blocks the other one
    if(deltaX === null) return
    if(deltaY === null) return setDeltaX(horizontalDelta)

    // first time this runs, it checks starting swiping direction X or Y
    if(Math.abs(horizontalDelta) < Math.abs(verticalDelta)) {
      setDeltaX(null)
      setDeltaY(verticalDelta)
    }
    if(Math.abs(horizontalDelta) > Math.abs(verticalDelta)) {
      setDeltaY(null)
      setDeltaX(horizontalDelta)
    }
  };

  const handleTouchEnd = () => {
    if(isSingleSlide) return
    const limit = 20
    if(deltaX > limit) handlePrev()
    else if(deltaX < -limit) handleNext()

    setIsDragging(false);
    setDeltaX(0)
    setDeltaY(0)
    setStartingPositionX(null)
  };
 ///////////////////////////////////////////////////////////////////////////////

  return (
    <div className="slider slider-infinite" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      <div ref={draggableRef} style={isSingleSlide ? {} : draggableStyles} className="draggable">
        {infiniteSlides.map((slide, index) => (
          <div key={index} className={`slide ${index === currentSlide ? "active" : ""}`} >
            {slide.mediaType === "video" ?
              <div className="video-container">
                <video ref={mediaRefs[index]} muted controls>
                  <source src={slide.url} type="video/mp4"/>
                  <source src={slide.url} type="video/mov"/>
                </video>
              </div> :
              <img ref={mediaRefs[index]} src={slide.url} onClick={handleFullscreen} alt={slide.alt} />}
          </div>
        ))}
      </div>
      {!isSingleSlide &&
        <>
          <Button type="button" className={`${cursorColor} ${isVideo ? "prev-video" : "prev"}`} onClick={handlePrev} />
          <Button type="button" className={`${cursorColor} ${isVideo ? "next-video" : "next"}`} onClick={handleNext} />
        </>
      }
      {slides.length &&
        <div className="page">
          {slides.map((_, index) => (
            <span key={index} className={currentDot === index ? "dot-active" : "dot"} onClick={() => handlePage(index + 1)}/>
          ))}
        </div>
      }
    </div>
  );
};

export default Slider;
