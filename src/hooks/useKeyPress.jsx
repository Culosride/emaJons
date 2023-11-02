import { useEffect } from "react";
import { useSelector } from "react-redux";

const useKeyPress = (targetKey, cb) => {
  const isModal = useSelector(state => state.ui.isModal)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if(isModal) return
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
