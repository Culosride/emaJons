import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFullscreen } from "../../features/UI/uiSlice";
import useKeyPress from "../../hooks/useKeyPress";
import Button from "../UI/Button"
import { useNavigate } from "react-router-dom";
import useMeasureRef from "../../hooks/useMeasureRef";


const Slider = ({ slides, cursorColor, content }) => {
  const infiniteSlides = [slides[slides.length -1], ...slides, slides[0]]
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // touch events state
  const [isDragging, setIsDragging] = useState(false)
  const [startingPosition, setStartingPosition] = useState()
  const [delta, setDelta] = useState(0)

  //slider state
  const [currentSlide, setCurrentSlide] = useState(1);
  const [translation, setTranslation] = useState(0)
  const [transition, setTransition] = useState("none")
  const [isTransitioning, setIsTransitioning] = useState(false);

  const isVideo = infiniteSlides[currentSlide].mediaType === "video"

  const mediaRefs = slides.map(() => useRef(null)); // Create a ref for each video

  const isFullscreen = useSelector(state => state.ui.isFullscreen)
  const currentCategory = useSelector(state => state.posts.currentCategory)
  const screenSize = useSelector((state) => state.ui.screenSize);

  const isMediumScreen = ["xs", "s", "m"].includes(screenSize);

  const isLastSlide = currentSlide  === infiniteSlides.length -1
  const isFirstSlide = currentSlide  === 0

  const draggableRef = (node) => {
    if(node) {
      const slideWidth = node?.firstChild.getBoundingClientRect().width
      const translation = slideWidth * currentSlide
      setTranslation(translation)
    }
  }

  useEffect(() => {
    mediaRefs.forEach((ref, index) => {
      if (ref.current?.localName === "video" && index !== currentSlide) {
        ref.current.pause();
      }
    });

    if (isLastSlide || isFirstSlide) {
      setTimeout(() => {
        setTransition("none");
        setCurrentSlide(isLastSlide ? 1 : slides.length);
      }, 250);
    }

  }, [currentSlide]);

  useEffect(() => {
    setTranslation(draggableRef.translation)
  }, [draggableRef])

  const draggableStyles = {
    transform: `translateX(-${translation}px)`,
    transition: transition
  }

  const handleNavigation = (direction) => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      if(!isLastSlide || !isFirstSlide) {
        setTransition("transform 0.25s ease");
      }
      setCurrentSlide((currentSlide + direction + infiniteSlides.length) % infiniteSlides.length);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 250);
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
    <div className="slider slider-mobile" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      {!isFullscreen && <Button className={`btn--close ${content ? "" : "h30"} ${isMediumScreen ? "medium" : ""}`} onClick={() => navigate(`/${currentCategory}`)}>
        <span className={"icon icon--close"}></span>
      </Button>}
      <div ref={draggableRef} style={draggableStyles} className="draggable">
        {infiniteSlides.map((slide, index) => (
          <div key={index} className={`slide ${index === currentSlide ? "active" : ""}`} style={{ zIndex: index === currentSlide ? 1 : 0 }}>
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
          {slides.map((slide, index) => (
            <span key={index} className={currentSlide - 1 === index ? "dot-active" : "dot"} onClick={() => handlePage(index + 1)}/>
          ))}
        </div>
      }
    </div>
  );
};

export default Slider;

// return (
//   <div className="slider" ref={sliderRef} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
//     {!isFullscreen && <Button className={`btn--close ${content ? "" : "h30"} ${isMediumScreen ? "medium" : ""}`} onClick={() => navigate(`/${currentCategory}`)}>
//       <span className={"icon icon--close"}></span>
//     </Button>}
//       {slides.map((slide, index) => (
//         <div key={index} className={`slide ${index === currentSlide ? "active" : ""}`} style={{ zIndex: index === currentSlide ? 1 : 0 }}>
//           {slide.mediaType === "video" ?
//             <div className="video-container">
//               <video ref={mediaRefs[index]} muted controls>
//                 <source src={slide.url} type="video/mp4"/>
//                 <source src={slide.url} type="video/mov"/>
//               </video>
//             </div> :
//             <img ref={mediaRefs[index]} src={slide.url} onClick={handleFullscreen} alt={slide.alt} />}
//         </div>
//       ))}
//     {slides.length > 1 &&
//       <>
//         <Button type="button" className={`${cursorColor} ${isVideo ? "prev-video" : "prev"}`} onClick={handlePrev} />
//         <Button type="button" className={`${cursorColor} ${isVideo ? "next-video" : "next"}`} onClick={handleNext} />
//       </>
//     }
//     {slides.length &&
//       <div className="page">
//         {slides.map((slide, index) => (
//           <span key={index} className={currentSlide === index ? "dot-active" : "dot"} onClick={() => handlePage(index)}/>
//         ))}
//       </div>
//     }
//   </div>
// );
