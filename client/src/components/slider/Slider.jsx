import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFullscreen } from "../../features/UI/uiSlice";
import useKeyPress from "../../hooks/useKeyPress";
import Button from "../UI/Button"
import useScreenSize from "../../hooks/useScreenSize";

const Slider = ({ slides, cursorColor }) => {
  const dispatch = useDispatch()
  const isSingleSlide = slides.length === 1
  const infiniteSlides = isSingleSlide ? slides : [slides[slides.length -1], ...slides, slides[0]]

  // Slider (derived) state
  const [currentSlide, setCurrentSlide] = useState(isSingleSlide ? 0 : 1);
  const [translation, setTranslation] = useState(0)
  const [transition, setTransition] = useState("none")
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isLastSlide = currentSlide === infiniteSlides.length - 1
  const isFirstSlide = currentSlide === 0
  const currentDot = isLastSlide ? 0 : isFirstSlide ? slides.length - 1 : currentSlide - 1;
  const mediaRefs = infiniteSlides.map(() => useRef(null)); // Create a ref for each slide
  const observer = useRef(null);

  // UI (derived) state
  const fullscreen = useSelector(state => state.ui.isFullscreen)
  const isFullscreen = fullscreen || Boolean(document.fullscreenElement)
  const isMediumScreen = useScreenSize(["xs", "s", "m"])
  const isVideo = infiniteSlides[currentSlide]?.mediaType === "video"
  const [buttonStyles, setButtonStyles] = useState({
    top: {},
    middle: {},
    bottom: {},
  });

  // Touch events state
  const [isDragging, setIsDragging] = useState(false)
  const [startingPositionX, setStartingPositionX] = useState(0)
  const [startingPositionY, setStartingPositionY] = useState(0)
  const [deltaX, setDeltaX] = useState(0)
  const [deltaY, setDeltaY] = useState(0)
  document.body.style.overflowY = (deltaY === null) ? 'hidden' : "auto"

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

  useEffect(() => {
    if (!isTransitioning && isVideo && mediaRefs[currentSlide].current) {
      const videoElement = mediaRefs[currentSlide].current;
      const rect = videoElement.getBoundingClientRect();
      const parentRect = videoElement.parentElement.getBoundingClientRect()
      const btnHeight = (parentRect.height - rect.height) / 2

      const updateButtonStyles = {
        top: {
          height: isMediumScreen ? `${btnHeight}px` : `${rect.top}px`,
        },
        middle: {
          height: `${rect.height}px`,
          width: `${rect.left}px`,
        },
        bottom: {
          height: isMediumScreen ? `${btnHeight}px` : `calc(100vh - ${rect.bottom}px`,
        },
      };

      setButtonStyles(updateButtonStyles);
    }
  }, [isTransitioning])


  const renderVideoNavigationButtons = () => (
    <>
      <Button style={buttonStyles.top} className={`${cursorColor} prev-video top`} onClick={handlePrev} />
      <Button style={buttonStyles.middle} className={`${cursorColor} prev-video middle`} onClick={handlePrev} />
      <Button style={buttonStyles.bottom} className={`${cursorColor} prev-video bottom`} onClick={handlePrev} />

      <Button style={buttonStyles.top} className={`${cursorColor} next-video top`} onClick={handleNext} />
      <Button style={buttonStyles.middle} className={`${cursorColor} next-video middle`} onClick={handleNext} />
      <Button style={buttonStyles.bottom} className={`${cursorColor} next-video bottom`} onClick={handleNext} />
    </>
  );

  const renderImageNavigationButtons = () => (
    <>
      <Button hasIcon={false} className={`${cursorColor} prev`} onClick={handlePrev} />
      <Button hasIcon={false} className={`${cursorColor} next`} onClick={handleNext} />
    </>
  );


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

  const slideStyle = {
    alignItems: alignSlide(),
  }

  function alignSlide() {
    if(screen.orientation.angle === 90 && screen.orientation.type.includes("landscape")) {
      return "flex-start"
    } else {
      return "center"
    }
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
          <div key={index} style={slideStyle} className={`slide ${index === currentSlide ? "active" : ""}`} >
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
      {!isSingleSlide && (isVideo ? renderVideoNavigationButtons() : renderImageNavigationButtons())}
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
