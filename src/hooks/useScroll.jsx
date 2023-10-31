import { useEffect } from "react";

export const useScroll = (customRef, cb = () => {}, options = {}) => {
  const { threshold, scrollClass } = options;

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= threshold) return customRef.current?.classList.remove(scrollClass);

      if (currentScrollY > lastScrollY) {
        customRef.current?.classList.add(scrollClass);
        cb();
      } else {
        customRef.current?.classList.remove(scrollClass);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [customRef, cb, threshold, scrollClass]);
};
