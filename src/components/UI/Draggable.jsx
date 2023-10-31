import React, {useRef, useState} from 'react'

export default function Draggable({ children, userRef, className }) {
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const daref = userRef

  const handleMouseDown = (e) => {
    setDragging(true);
    setStartX(e.pageX + daref.current.scrollLeft);
  };

  const handleMouseUp = (e) => {
    setDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    daref.current.scrollLeft = startX - e.pageX
  };

  const handleTouchStart = (e) => {
    setDragging(true);
    setStartX(e.touches[0].pageX + daref.current.scrollLeft);
  };

  const handleTouchEnd = () => {
    setDragging(false);
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;
    daref.current.scrollLeft = startX - e.touches[0].pageX
  };

  return (
    <div
      ref={userRef}
      className={`draggable-container ${className} ${dragging && "dragging"}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onMouseLeave={() => setDragging(false)}
      onTouchCancel={() => setDragging(false)}
    >
      {children}
    </div>
  );
}
