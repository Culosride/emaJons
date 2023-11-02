import React, { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { setModal } from "../../features/UI/uiSlice";

const modalRoot = document.getElementById("modal");

export default function Modal({ children, open, className = "" }) {
  const dialogRef = useRef();
  const dispatch = useDispatch()

  useEffect(() => {
    // recommended: store the current ref in a variable, cause
    // the cleanup will run after the effect block,
    // so theoretically the ref content could change in-between (not in this case, it will always ref the dialog)
    const modal = dialogRef.current // store the current ref
    open && modal.showModal()

    const handleCancel = (e) => {
      dispatch(setModal(false))
    }

    modal.addEventListener("cancel", handleCancel)

    return () => {
      modal.close();
      modal.removeEventListener("cancel", handleCancel)
    } // runs when dependency changes
  }, [open]);

  return createPortal(
    <dialog className={`modal ${className}`} ref={dialogRef}>
      {children}
    </dialog>,
    modalRoot
  );
}
