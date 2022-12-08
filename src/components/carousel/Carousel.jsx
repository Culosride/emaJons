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
    fade: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
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

  return (
    <div style={{margin: '0 auto'}}>
      <Slider {...settings} ref={slider}>
        {imageElements}
      </Slider>
    </div>
  );
}
