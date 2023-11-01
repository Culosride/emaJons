import React, {useRef, useState} from 'react'

export default function Draggable({ children, userRef, isSmallScreen, className }) {
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleMouseDown = (e) => {
    setDragging(true);
    setStartX(e.pageX + userRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    userRef.current.scrollLeft = startX - e.pageX
  };

  const handleTouchStart = (e) => {
    setDragging(true);
    setStartX(e.touches[0].pageX + userRef.current.scrollLeft);
  };

  const handleTouchEnd = () => {
    setDragging(false);
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;
    userRef.current.scrollLeft = startX - e.touches[0].pageX
  };

  const classStyle = `draggable-container ${className} ${(dragging && isSmallScreen) ? "dragging" : ""}`

  return (
    <div
      ref={userRef}
      className={classStyle}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setDragging(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onTouchCancel={() => setDragging(false)}
    >
      {children}
    </div>
  );
}
