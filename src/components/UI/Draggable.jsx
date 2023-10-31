import React, {useRef, useState} from 'react'

export default function Draggable({ children, userRef, className }) {
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const localRef = userRef

  const handleMouseDown = (e) => {
    setDragging(true);
    setStartX(e.pageX + localRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    localRef.current.scrollLeft = startX - e.pageX
  };

  const handleTouchStart = (e) => {
    setDragging(true);
    setStartX(e.touches[0].pageX + localRef.current.scrollLeft);
  };

  const handleTouchEnd = () => {
    setDragging(false);
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;
    localRef.current.scrollLeft = startX - e.touches[0].pageX
  };

  return (
    <div
      ref={userRef}
      className={`draggable-container ${className} ${dragging ? "dragging" : ""}`}
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
