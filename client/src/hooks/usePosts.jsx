import { useState, useEffect } from "react";
import { fetchPostsByCategory, selectPostsByCategory, } from "../features/posts/postsSlice";
import { useDispatch, useSelector } from "react-redux";

const usePosts = (category) => {
  const dispatch = useDispatch();
  const [pageNum, setPageNum] = useState(1);

  useEffect(() => {
    if (pageNum > 1) {
      const controller = new AbortController();
      const { signal } = controller;

      dispatch(fetchPostsByCategory({ category, pageNum}, { signal }));

      return () => controller.abort();
    }
  }, [pageNum, dispatch]);

  return { setPageNum };
};

export default usePosts;
