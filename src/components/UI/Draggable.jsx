import React, {useRef, useState} from 'react'

export default function Draggable({ children, userRef, isSmallScreen, className }) {
  const [isDragging, setIsDragging] = useState(false);
  const [startDragging, setStartDragging] = useState(false)
  const [startX, setStartX] = useState(0);

  //////////////////////////// --- mouse events --- ////////////////////////////
  const handleMouseDown = (e) => {
    setStartDragging(true)
    setStartX(e.pageX + userRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!startDragging) return;

    const movementX = e.pageX - (startX - userRef.current.scrollLeft);
    if (Math.abs(movementX) > 5 && startDragging) setIsDragging(true)
    userRef.current.scrollLeft = startX - e.pageX
  };

  const handleMouseUp = () => {
    setStartDragging(false)
    setIsDragging(false);
  };

  //////////////////////////// --- touch events --- ////////////////////////////
  const handleTouchStart = (e) => {
    setStartDragging(true)
    setStartX(e.touches[0].pageX + userRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!startDragging) return;
    const movementX = e.touches[0].pageX - (startX - userRef.current.scrollLeft);
    if (Math.abs(movementX) > 5 && startDragging) setIsDragging(true)
    userRef.current.scrollLeft = startX - e.touches[0].pageX
  };

  const handleTouchEnd = () => {
    setStartDragging(false)
    setIsDragging(false);
  };
  //////////////////////////////////////////////////////////////////////////////

  const classStyle = `draggable-container ${className} ${(isDragging && isSmallScreen) ? "dragging" : ""}`

  return (
    <div
      ref={userRef}
      className={classStyle}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setStartDragging(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onTouchCancel={() => setStartDragging(false)}
    >
      {children}
    </div>
  );
}
