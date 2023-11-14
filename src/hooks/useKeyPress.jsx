import { useEffect } from "react";
import { useSelector } from "react-redux";

const useKeyPress = (targetKey, cb) => {
  const modals = useSelector(state => state.ui.modals)

  useEffect(() => {
    // avoids unexpected behaviors if a modal is open
    if(Object.entries(modals).some(([key, value]) => value)) return

    const handleKeyDown = (e) => {

      if (e.key === targetKey){
        e.preventDefault()
        cb()
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [targetKey, cb]);
};
export default useKeyPress;
