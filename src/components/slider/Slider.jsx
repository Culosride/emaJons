import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFullscreen } from "../../features/UI/uiSlice";
import useKeyPress from "../../hooks/useKeyPress";
import Button from "../UI/Button"
import { useNavigate } from "react-router-dom";

const Slider = ({ slides, cursorColor, content }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const isVideo = slides[currentSlide].mediaType === "video"
  const dispatch = useDispatch()
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = slides.map(() => useRef(null)); // Create a ref for each video
  const isFullscreen = useSelector(state => state.ui.isFullscreen)
  const currentCategory = useSelector(state => state.posts.currentCategory)
  const screenSize = useSelector((state) => state.ui.screenSize);

  // const isSmallScreen = screenSize === "xs" || screenSize === "s";
  const isMediumScreen = screenSize === "xs" || screenSize === "s" || screenSize === "m";
  const navigate = useNavigate()

  useEffect(() => {
    if(isVideo) dispatch(toggleFullscreen(false))
  }, [isVideo])

  useEffect(() => {
    videoRefs.forEach((videoRef, index) => {
      if (videoRef.current && index !== currentSlide) {
        videoRef.current.pause();
      }
    });
  }, [currentSlide]);

  const handleNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((currentSlide + 1) % slides.length);
        setIsTransitioning(false);
      }, 250);
    }
  };

  const handlePrev = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);
        setIsTransitioning(false);
      }, 250);
    }
  };

  useKeyPress("ArrowRight", handleNext)
  useKeyPress("ArrowLeft", handlePrev)

  const handlePage = page => {
    setCurrentSlide(page);
  };

  const handleFullscreen = () => {
    dispatch(toggleFullscreen())
  }

  return (
    <div className="slider">
      {!isFullscreen && <Button className={`btn--close ${content ? "" : "h30"} ${isMediumScreen ? "medium" : ""}`} onClick={() => navigate(`/${currentCategory}`)}>
        <span className={"icon icon--close"}></span>
      </Button>}
      {slides.map((slide, index) => (
        <div key={index} className={`slide ${index === currentSlide ? "active" : ""}`} style={{ zIndex: index === currentSlide ? 1 : 0 }}>
          {slide.mediaType === "video" ?
            <div className="video-container">
              <video ref={videoRefs[index]} muted controls>
                <source src={slide.url} type="video/mp4"/>
                <source src={slide.url} type="video/mov"/>
              </video>
            </div> :
            <img src={slide.url} onClick={handleFullscreen} alt={slide.alt} />}
        </div>
      ))}
      {slides.length > 1 &&
        <>
          <Button type="button" className={`${cursorColor} ${isVideo ? "prev-video" : "prev"}`} onClick={handlePrev} />
          <Button type="button" className={`${cursorColor} ${isVideo ? "next-video" : "next"}`} onClick={handleNext} />
        </>
      }
      {slides.length &&
        <div className="page">
          {slides.map((slide, index) => (
            <span key={index} className={currentSlide === index ? "dot-active" : "dot"} onClick={() => handlePage(index)}/>
          ))}
        </div>
      }
    </div>
  );
};

export default Slider;
