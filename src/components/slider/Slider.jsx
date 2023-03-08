import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toggleFullscreen } from "../../features/posts/postsSlice";

const Slider = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const isVideo = slides[currentSlide].mediaType === "video"
  const dispatch = useDispatch()
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if(isVideo) dispatch(toggleFullscreen(false))
  }, [isVideo])

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

  const handlePage = page => {
    setCurrentSlide(page);
  };

  const handleFullscreen = () => {
    dispatch(toggleFullscreen())
  }


  return (
    <div className="slider">
      {slides.map((slide, index) => (
        <div key={index} className={`slide ${index === currentSlide ? "active" : ""}`} style={{ zIndex: index === currentSlide ? 1 : 0 }}>
          {slide.mediaType === "video" ?
            <video muted controls>
              <source src={slide.url} type="video/mp4"/>
              <source src={slide.url} type="video/mov"/>
            </video> :
            <img src={slide.url} onClick={handleFullscreen} alt={slide.alt} />}
        </div>
      ))}
        <button className={`${isVideo ? "prev" : "prev full"}`} onClick={handlePrev} />
        {isVideo && <button className="prev-video" onClick={handlePrev} />}

        <button className={`${isVideo ? "next" : "next full"}`} onClick={handleNext} />
        {isVideo && <button className="next-video" onClick={handleNext} />}

        {slides.length &&
        <div className="page">
          {slides.map((slide, index) => (
            <span key={index} className={currentSlide === index ? "dot-active" : "dot"} onClick={() => handlePage(index)}/>
          ))}
        </div>}
    </div>
  );
};

export default Slider;
