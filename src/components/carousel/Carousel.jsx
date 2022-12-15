import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import Item from '../item/Item';

export default function Carousel({ images, toggleFullScreen }) {
  const slider = useRef()
  // const [activeSlide, setActiveSlide] = useState(0)

  const settings = {
    className: "inner-slider-div",
    dots: true,
    infinite: true,
    fade: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    dotsClass: "slick-dots",
    customPaging: (i) => {
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
      toggleFullScreen={toggleFullScreen}
      className="slides"
      />
  })

  const next = () => {
    slider.current.slickNext();
  }
  const previous = () => {
    slider.current.slickPrev();
  }

  return (
    <div className="images-container carousel-50">
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
