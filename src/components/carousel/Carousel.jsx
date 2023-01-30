import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import Item from '../item/Item';

export default function Carousel({ media, toggleFullScreen }) {
  const slider = useRef()


  useEffect(() => {
    media.forEach((_, i) => {
      const slide = document.querySelector(`[data-index="${i}"]`)
      slide.parentElement.classList.add('center-mobile')
      slide.style.transition = 'left 200ms ease, width 200ms ease, opacity 600ms ease 0s, visibility 600ms ease 0s'
    })
  }, [])

  const settings = {
    className: "inner-slider-div",
    accessibility: true,
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
    responsive: [
      {
        breakpoint: 1040,
        settings: {
          fade: false,
          swipe: true
        }
      }
    ]
  };

  const next = () => {
    slider.current.slickNext();
  }
  const previous = () => {
    slider.current.slickPrev();
  }
  
  const mediaElements = media.map((med, i) => {
    return (
      <Item
      url={med.url}
      key={med.publicId}
      type={med.mediaType}
      toggleFullScreen={toggleFullScreen}
      id={i}
      className="slides"
      />
    )
  })

  return (
    <div className="images-container carousel">
      <Slider {...settings} ref={slider}>
        {mediaElements}
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
