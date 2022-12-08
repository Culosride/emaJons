import React, { useRef, useState } from "react";
import Slider from "react-slick";
import Item from '../item/Item';

export default function Carousel({ images }) {
  const slider = useRef();

  const [activeSlide, setActiveSlide] = useState(0)
  const [nextSlide, setNextSlide] = useState(1)

  const settings = {
    className: "slider variable-width inner-slider-div",
    arrows: true,
    infinite: false,
    centerMode: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    focusOnSelect: true,
    beforeChange: (current, next) => setActiveSlide(next),
    afterChange: (current) => setNextSlide(current),
    appendDots: dots => (
      <div
        style={{
          backgroundColor: "#ddd",
          borderRadius: "10px",
          padding: "10px"
        }}
      >
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div
        style={{
          width: "30px",
          color: "blue",
          margin: '0 4px',
          backgroundColor: 'green',
          border: "1px blue solid"
        }}
      >
        {i + 1}
      </div>
    ),
  };

  const imageElements = images.map((image, i) => {
    const direction = (activeSlide + 1 === i) && 'e-resize' || (activeSlide - 1 === i) && 'w-resize';
    return <Item
      imageUrl={image.imageUrl}
      key={image.publicId}
      id={i}
      className={
        (activeSlide === i) ? 'selected-slide' : `slides ${direction}`
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
