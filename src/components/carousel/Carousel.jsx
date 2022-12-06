import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Item from '../item/Item';

// if count is the same as image id then add selected img
// if count -1 is same as image id -1 add prev
// if count +1 is same as image id +1 add next

export default function Carousel({ images }) {
  const [count, setCount] = useState(0);

  const handleClick = (e) => {
    const direction = e.target.dataset.value;
    if (direction === 'prev' && count > 0) {
      setCount(prev => prev - 1)
    } else if (direction === 'next' && count < images.length - 1) {
      setCount(prev => prev + 1)
    }
  }

  const imageElements = images.map(image => (
    <Item key={image.publicId} imageUrl={image.imageUrl} height={'65vh'} />
  ))

  const indicators = images.map((image, i) => (
    <div className={count === i ? 'selected-indicator indicator' : 'indicator'} key={image.publicId}></div>
  ))

  return (
    <>
      <div className="images-container">
        {images[count - 1] &&
          <div className="w-resize images-slider" data-value="prev" onClick={handleClick} style={{backgroundImage: `url(${images[count - 1].imageUrl})`}}>
          </div> ||
          <div className="images-slider"></div>
        }
        <div className="selected-image">
          {imageElements[count]}
        </div>
        {images[count + 1] &&
          <div className="e-resize images-slider" data-value="next" onClick={handleClick} style={{backgroundImage: `url(${images[count + 1].imageUrl})`}}>
          </div> ||
          <div className="images-slider"></div>
        }
      </div>
      <div className="indicators">
        {indicators}
      </div>
    </>
  );
}