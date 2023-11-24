import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFullscreen } from "../../features/UI/uiSlice";
import useKeyPress from "../../hooks/useKeyPress";
import Button from "../UI/Button"
import { useNavigate } from "react-router-dom";

const Slider = ({ slides, cursorColor, content }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isFullscreen = useSelector(state => state.ui.isFullscreen)
  const currentCategory = useSelector(state => state.posts.currentCategory)
  const screenSize = useSelector((state) => state.ui.screenSize);

  // slider state
  const [currentSlide, setCurrentSlide] = useState(1);
  const [translation, setTranslation] = useState(0)
  const [transition, setTransition] = useState("none")
  const [isTransitioning, setIsTransitioning] = useState(false);

  // touch events state
  const [isDragging, setIsDragging] = useState(false)
  const [startingPosition, setStartingPosition] = useState()
  const [delta, setDelta] = useState(0)

  // derived state
  const infiniteSlides = [slides[slides.length -1], ...slides, slides[0]]
  const isVideo = infiniteSlides[currentSlide].mediaType === "video"
  const isMediumScreen = ["xs", "s", "m"].includes(screenSize);
  const isLastSlide = currentSlide === infiniteSlides.length - 1
  const isFirstSlide = currentSlide === 0
  const currentDot = isLastSlide ? 0 : isFirstSlide ? slides.length - 1 : currentSlide - 1;

  const mediaRefs = slides.map(() => useRef(null)); // Create a ref for each video
  const observer = useRef(null);

  useEffect(() => {
    mediaRefs.forEach((ref, index) => {
      if (ref.current?.localName === "video" && index !== currentSlide) {
        ref.current.pause();
      }
    });
  }, [currentSlide]);

  const calcTranslation = (node) => {
    if(node) {
      const slideWidth = node.firstChild.getBoundingClientRect().width
      const newTranslation = slideWidth * currentSlide
      setTranslation(newTranslation)

      if (isLastSlide || isFirstSlide) {
        setTimeout(() => {
          setCurrentSlide(isLastSlide ? 1 : slides.length);
          setTransition("none");
        }, 250);
      }
    }
  }

  const draggableRef = useCallback(element => {
    if (observer.current) observer.current.disconnect();

    observer.current = new ResizeObserver((entries) => {
      calcTranslation(entries[0].target)
    });

    if (element) observer.current.observe(element);
  }, [currentSlide])

  const draggableStyles = {
    transform: `translateX(-${translation}px)`,
    transition: transition
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

  const handleNext = () => slides.length > 1 && handleNavigation(1);
  const handlePrev = () => slides.length > 1 && handleNavigation(-1);

  useKeyPress("ArrowRight", handleNext)
  useKeyPress("ArrowLeft", handlePrev)

  const handlePage = (page) => setCurrentSlide(page);
  const handleFullscreen = () => {
    setTransition("none")
    dispatch(toggleFullscreen());
  }

  //////////////////////////// --- touch events --- ////////////////////////////
  const handleTouchStart = (e) => {
    setStartingPosition(e.touches[0].clientX)
    setIsDragging(true)
  };

  const handleTouchMove = (e) => {
    if(!isDragging) return
    const currentPosition = e.touches[0].clientX;
    const deltaX = currentPosition - startingPosition;
    setDelta(deltaX)
  };

  const handleTouchEnd = () => {
    const limit = 20
    console.log(delta)
    if(delta > limit) handlePrev()
    else if(delta < -limit) handleNext()

    setIsDragging(false);
    setDelta(0)
    setStartingPosition(null)
  };
 ///////////////////////////////////////////////////////////////////////////////

  return (
    <div className="slider slider-infinite" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      {!isFullscreen && <Button className={`btn--close ${content ? "" : "h30"} ${isMediumScreen ? "medium" : ""}`} onClick={() => navigate(`/${currentCategory}`)}>
        <span className={"icon icon--close"}></span>
      </Button>}
      <div ref={draggableRef} style={draggableStyles} className="draggable">
        {infiniteSlides.map((slide, index) => (
          <div key={index} className={`slide ${index === currentSlide ? "active" : ""}`} style={{ zIndex: index === currentSlide ? 1 : 0}}>
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
      {slides.length > 1 &&
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
