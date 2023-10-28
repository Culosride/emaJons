import React, { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const modalRoot = document.getElementById("modal");

export default function Modal({ children, open, className = "" }) {
  const dialogRef = useRef();

  useEffect(() => {
    // recommended: store the current ref in a variable, cause
    // the cleanup will run after the effect block,
    // so theoretically the ref content could change in-between (not in this case, it will always ref the dialog)

    const modal = dialogRef.current // store the current ref
    open && modal.showModal()

    return () => modal.close(); // runs when dependency changes
  }, [open]);

  return createPortal(
    <dialog className={`modal ${className}`} ref={dialogRef}>
      {children}
    </dialog>,
    modalRoot
  );
}
