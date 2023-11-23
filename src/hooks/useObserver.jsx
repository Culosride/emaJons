// import { useCallback, useEffect, useRef } from "react";

// const useObserver = (callback, element,) => {
//   // const observer = useRef(null);
//   const isFullscreen = useSelector(state => state.ui.isFullscreen)
//   const current = element?.current
//   const observer = useRef();


//   const elementRef = useCallback(element => {
//     if (observer.current) observer.current.disconnect();
//     element.current = new ResizeObserver(callback);

//     if (element) observer.current.observe(element);
//   }, [isFullscreen, currentSlide],)


//   const lastPostRef = useCallback((post) => {
//     if (status !== "succeeded") return;
//     if (observer.current) observer.current.disconnect();
//     observer.current = new IntersectionObserver(
//       (entries) => {
//         if(entries[0].isIntersecting && hasMorePosts) {
//           setPageNum((p) => p + 1);
//         }
//       }, { threshold: 0.8 }
//       );
//       if (post) observer.current.observe(post);
//   }, [status, hasMorePosts, activeTag]);



//   useEffect(() => {
//     if (observer?.current && current) {
//       observer.current.unobserve(current);
//     }
//     const resizeObserverOrPolyfill = ResizeObserver;
//     observer.current = new resizeObserverOrPolyfill(callback);
//     observe();

//     return () => {
//       if (observer?.current && current) {
//         observer.current.unobserve(element.current);
//       }
//     };
//   }, [current]);

//   const observe = () => {
//     if (current && observer.current) {
//       observer.current.observe(element.current);
//     }
//   };
// };

// export default useObserver;
