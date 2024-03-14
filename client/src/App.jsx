import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setScreenSize } from "./features/UI/uiSlice";
import { router } from "./routes/router";
import { fetchPosts, fetchTags } from "./API";

export default function App() {
  const dispatch = useDispatch();

  ////////////////////////// Checks screensize for UI //////////////////////////
  useEffect(() => {
    const breakpoints = [
      { size: "xs", minWidth: 0, maxWidth: 599 },
      { size: "s", minWidth: 600, maxWidth: 767 },
      { size: "m", minWidth: 767, maxWidth: 991 },
      { size: "l", minWidth: 992, maxWidth: 1199 },
      { size: "xl", minWidth: 1200, maxWidth: 9999 },
    ];

    let previousSize = null;

    const handleResize = () => {
      const currentSize = breakpoints.find(
        (breakpoint) =>
          window.innerWidth >= breakpoint.minWidth &&
          window.innerWidth <= breakpoint.maxWidth
      );

      if (currentSize && currentSize.size !== previousSize) {
        dispatch(setScreenSize(currentSize.size));
        previousSize = currentSize.size;
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <RouterProvider router={router} />;
}

export async function loader() {
  const { data } = await fetchTags();
  const posts = await fetchPosts()

  return {
    availableTags: data.availableTags,
    categoryTags: data.categoryTags,
    posts: posts.data,
  }
}
