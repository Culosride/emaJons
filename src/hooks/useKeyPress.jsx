import { useEffect } from "react";

const useKeyPress = (targetKey, cb) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === targetKey) {
        cb();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [targetKey, cb]);
};
export default useKeyPress;
