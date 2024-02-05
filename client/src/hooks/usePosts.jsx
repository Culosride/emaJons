import { useState, useEffect } from "react";
import { fetchPostsByCategory, selectPostsByCategory, } from "../features/posts/postsSlice";
import { useDispatch, useSelector } from "react-redux";

const usePosts = (category) => {
  const dispatch = useDispatch();
  const [pageNum, setPageNum] = useState(1);
  const posts = useSelector((state) => selectPostsByCategory(state, category));

  useEffect(() => {
    if (posts.length === 0 || (posts && pageNum > 1)) {
      const controller = new AbortController();
      const { signal } = controller;

      const pageNumber = posts.length === 1 ? 1 : pageNum
      dispatch(fetchPostsByCategory({ category, pageNum: pageNumber}, { signal }));

      return () => controller.abort();
    }
  }, [pageNum, dispatch]);

  return { setPageNum };
};

export default usePosts;
