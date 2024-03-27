import React, { forwardRef } from "react";
import { Link } from "react-router-dom";

const PostPreview = forwardRef(({ mediaType, handleClick, src, alt, hoverContent, linkUrl }, ref) => {
  const handleMouseEnter = (e) => {
    e.target.play();
  };
  const handleMouseLeave = (e) => {
    e.target.load();
  };

  return (
    <Link onClick={handleClick} to={linkUrl} ref={ref} className="post-preview__link">
      {mediaType === "image" && <img aria-label={`${mediaType}-preview`} className={`post-preview__${mediaType}`} src={src} alt={alt} />}
      {mediaType === "video" && (
        <video aria-label={`${mediaType}-preview`} className={`post-preview__${mediaType}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} loop muted>
          <source src={src} type="video/mp4"/>
          <source src={src} type="video/mov"/>
        </video>
      )}
      <div className="post-preview__info">{hoverContent}</div>
    </Link>
  );
});

export default PostPreview;
