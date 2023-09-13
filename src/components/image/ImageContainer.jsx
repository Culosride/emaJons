import React, { forwardRef } from "react";
import { Link } from "react-router-dom";

const ImageContainer = forwardRef(({ mediaType, src, alt, hoverContent, linkUrl, isLast }, ref) => {
  const handleMouseEnter = (e) => {
    e.target.play();
  };
  const handleMouseLeave = (e) => {
    e.target.load();
  };
  const elClass = isLast ? "image-container last" : "image-container"
  const content = ref ?
    (
      <Link to={linkUrl} ref={ref} className={elClass}>
        {mediaType === "image" && <img className={"image"} src={src} alt={alt} />}
        {mediaType === "video" && (
          <video className={"image"} onMouseEnter={handleMouseEnter} alt={alt} onMouseLeave={handleMouseLeave} loop muted>
            <source src={src} type="video/mp4"/>
            <source src={src} type="video/mov"/>
          </video>
        )}
        <div className="post-info">{hoverContent}</div>
      </Link>
    ) :
    (
      <Link to={linkUrl} className={elClass}>
        {mediaType === "image" && <img className={"image"} src={src} alt={alt} />}
        {mediaType === "video" && (
          <video className={"image"} onMouseEnter={handleMouseEnter} alt={alt} onMouseLeave={handleMouseLeave} loop muted>
            <source src={src} type="video/mp4"/>
            <source src={src} type="video/mov"/>
          </video>
        )}
        <div className="post-info">{hoverContent}</div>
      </Link>
    )

  return content
});

export default ImageContainer;
