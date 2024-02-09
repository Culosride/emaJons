import { useState, useEffect } from "react";
import { fetchPostsByCategory } from "../features/posts/postsSlice";
import { useDispatch } from "react-redux";
import { POSTS_TO_LOAD } from "../config/roles";

const usePosts = (category, postsLength) => {
  const dispatch = useDispatch();
  const [pageNum, setPageNum] = useState(1);

  useEffect(() => {
    // Only fires when the first page of posts is loaded and if there are more
    // posts per current category then the set page size (POSTS_TO_LOAD).
    // So if a category has in total less then POSTS_TO_LOAD it won't try to
    // load more.
    if (pageNum > 1 && postsLength > POSTS_TO_LOAD - 1) {
      const controller = new AbortController();
      const { signal } = controller;

      dispatch(fetchPostsByCategory({ category, pageNum}, { signal }));

      return () => controller.abort();
    }
  }, [pageNum, dispatch]);

  return { setPageNum };
};

export default usePosts;
