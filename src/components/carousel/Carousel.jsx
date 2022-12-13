import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import Item from '../item/Item';

export default function Carousel({ images }) {
  const slider = useRef();

  const [activeSlide, setActiveSlide] = useState(0)
  const [nextSlide, setNextSlide] = useState(1)

  const settings = {
    className: "slider variable-width inner-slider-div",
    dots: true,
    infinite: true,
    fade: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    dotsClass: "slick-dots",
    customPaging: function(i) {
      return (
        <a>
          <div className='indicator'></div>
        </a>
      );
    },
  };

  const imageElements = images.map((image, i) => {
    return <Item
      imageUrl={image.imageUrl}
      key={image.publicId}
      id={i}
      className={
        (activeSlide === i) ? 'selected-slide' : `slides`
      } />
  })

  function next() {
    slider.current.slickNext();
  }
  function previous() {
    slider.current.slickPrev();
  }

  return (
    <div style={{height: '100vh'}}>
      <Slider {...settings} ref={slider}>
        {imageElements}
      </Slider>
      <div className="slider-navigation">
        <div className="button-prev" onClick={previous}>
        </div>
        <div className="button-next" onClick={next}>
        </div>
      </div>
    </div>
  );
}
