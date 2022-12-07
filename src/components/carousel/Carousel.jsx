import React, { useEffect, useState } from "react";
import Item from '../item/Item';

const loadImage = (setImageDimensions, imageUrl, count) => {
  const img = new Image();
  img.src = imageUrl;
  const imageHeight = document.documentElement.clientHeight * 0.74;

  img.onload = () => {
    setImageDimensions((prev) => {
    return {
      ...prev,
      [count]: img.width * imageHeight / img.height
    }});
  };
};

function getWindowSize() {
  const { innerWidth } = window;
  return innerWidth;
}

export default function Carousel({ images }) {
  const [count, setCount] = useState(0);
  const [imageDimensions, setImageDimensions] = useState({})
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [translate, setTranslate] = useState(0);

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  useEffect(() => {
    loadImage(setImageDimensions, images[count].imageUrl, count)
  }, [count]);

  const handleClick = (e) => {
    const direction = e.target.dataset.value;
    if (direction === 'prev' && count > 0) {
      (count === 1) ? setTranslate(0) : setTranslate(prev => prev - imageDimensions[count - 1] - 20)
      setCount(prev => prev - 1)
    } else if (direction === 'next' && count < images.length - 1) {
      setCount(prev => prev + 1)
      setTranslate(prev => prev + imageDimensions[count] + 20)
    }
  }

  const imageElements = images.map((image, i) => {
    if (count === i) {
      return <Item key={image.publicId} imageUrl={image.imageUrl} className='current' />
    } else if (count + 1 === i) {
      return <Item key={image.publicId} imageUrl={image.imageUrl} className='e-resize' dataValue='next' handleClick={(e) => handleClick(e)} />
    } else if (count - 1 === i) {
      return <Item key={image.publicId} imageUrl={image.imageUrl} className='w-resize' dataValue='prev' handleClick={(e) => handleClick(e)} />
    } else {
      return <Item key={image.publicId} imageUrl={image.imageUrl} />
    }
  })

  const indicators = images.map((image, i) => (
    <div className={count === i ? 'selected-indicator indicator' : 'indicator'} key={image.publicId}></div>
  ))

  return (
    <>
      <div className="handlers" data-value="next" onClick={handleClick}></div>
      <div className="carousel">
        <div className="inner" style={{ transform: `translateX(-${translate}px)`, paddingLeft: `${(windowSize - imageDimensions[count])/2}px`}}>
          {imageElements}
        </div>
      </div>
      <div className="indicators">
        {indicators}
      </div>
    </>
  );
}
