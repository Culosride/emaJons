import React, { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { setModal } from "../../features/UI/uiSlice";
import Button from "./Button";

const modalRoot = document.getElementById("modal");

export default function Modal({ children, description, confirmDelete, modalKey, className = "" }) {
  const dialogRef = useRef();
  const dispatch = useDispatch()
  const modals = useSelector(state => state.ui.modals)

  useEffect(() => {
    if(!modals[modalKey]) return
    // recommended: store the current ref in a variable, cause
    // the cleanup will run after the effect block,
    // so theoretically the ref content could change in-between (not in this case, it will always ref the dialog)
    const currentModal = dialogRef.current // store the current ref
    modals[modalKey] && currentModal.showModal()

    const handleCancel = () => {
      dispatch(setModal({ key: modalKey, state: false }))
    }

    currentModal.addEventListener("cancel", handleCancel)

    return () => {
      currentModal.close();
      currentModal.removeEventListener("cancel", handleCancel)
    } // runs when dependency changes
  }, [modals[modalKey]]);

  const content =
    <dialog className={`modal ${className}`} ref={dialogRef}>
      <div>
        <p>{description}</p>
        <div className="modal-actions-container">
          <Button type="button" className="modal-action" onClick={() => dispatch(setModal({ key: modalKey, state: false }))}>No</Button>
          <Button type="button" className="modal-action" onClick={confirmDelete}>Yes</Button>
        </div>
      </div>
    </dialog>

  return createPortal(content, modalRoot);

}
