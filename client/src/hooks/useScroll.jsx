import { useEffect } from "react";
import { useSelector } from "react-redux";

export const useScroll = (customRef, cb = () => {}, options = {}) => {
  const { threshold, scrollClass } = options;
  const savedScrollY = useSelector(state => state.ui.scrollPosition)

  useEffect(() => {
    let lastScrollY = savedScrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentRef = customRef.current

      if (currentScrollY <= threshold) {
        return currentRef?.classList.remove(scrollClass)
      };

      if (currentScrollY > lastScrollY) {
        currentRef?.classList.add(scrollClass);
        cb();
      } else {
        currentRef?.classList.remove(scrollClass);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [customRef, cb, threshold, scrollClass]);
};
