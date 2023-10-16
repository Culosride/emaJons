import React, { useCallback, useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux"; // hook to select data from redux store
import { setCurrentCategory } from "../../features/posts/postsSlice";
import { useParams } from "react-router-dom";
import ImageContainer from "../image/ImageContainer";
import usePosts from "../../hooks/usePosts";
const _ = require("lodash");

export default function AllPosts() {
  const params = useParams();
  const dispatch = useDispatch();
  const status = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);

  const {
    isError,
    error: usePostsError,
    hasNextPage,
    setPageNum,
  } = usePosts(params.category);

  const posts = useSelector((state) => state.posts.posts);
  const postsByCategory = posts.filter(post => post.category === _.capitalize(params.category));
  const [filteredPosts, setFilteredPosts] = useState(postsByCategory);
  const allTags = postsByCategory.flatMap(post => post.postTags.map((tag) => tag));
  const sortedTags = [...new Set(allTags.sort((a, b) => b.localeCompare(a)))];
  const [tagsFilter, setTagsFilter] = useState([]);

  let postElements = [];

  useEffect(() => {
    dispatch(setCurrentCategory(params.category));
  }, [params.category]);


  useEffect(() => {
    const filtered = tagsFilter
    ? postsByCategory.filter((post) => post.postTags.includes(tagsFilter))
    : postsByCategory;
    setFilteredPosts(filtered);
  }, [tagsFilter]);

  const displayPosts = (posts) => {
    return posts.map((post, i) => {
      const { mediaType, url } = post.media[0];
      const getPreviewURL = () => {
        if (mediaType === "video") {
          return post.media[0].preview;
        } else {
          return url;
        }
      };

      return (
        post.media.length && (
          <ImageContainer
            key={post._id}
            mediaType={post.media[0].mediaType}
            id={post._id}
            ref={i === posts.length - 1 ? lastPostRef : undefined}
            linkUrl={`/${params.category}/${post._id}`}
            src={getPreviewURL()}
            alt={post.title}
            hoverContent={post.title.split(",").join("").toUpperCase()}
          />
        )
      );
    });
  };

  const intObserver = useRef();
  const lastPostRef = useCallback((post) => {
    if (status !== "succeeded") return;
    if (intObserver.current) intObserver.current.disconnect();

    intObserver.current = new IntersectionObserver(
      (entries) => {
        if(entries[0].isIntersecting && hasNextPage) {
          setPageNum((p) => p + 1);
        }
      }, { threshold: 0.5 }
      );
      if (post) intObserver.current.observe(post);
    }, [status, hasNextPage]);

  postElements =
    (filteredPosts.message && filteredPosts.message) ||
    (filteredPosts.length && displayPosts(filteredPosts)) ||
    displayPosts(postsByCategory);

  if (isError) return <p className="center">Error: {usePostsError.message}</p>;
  if (status === "failed") {
        postElements = <p>{error}</p>;
  } else if (status === "loading") {
    postElements = <p>Loading..</p>;
  }

  // filter posts on tag click
  const handleClick = (e) => {
    e.preventDefault();
    const selectedTag = e.target.getAttribute("data-value");

    if (tagsFilter === selectedTag) {
      setTagsFilter("");
    } else {
      setTagsFilter(selectedTag);
    }

    // Remove the 'tag-active' class from all tag links
    const links = document.querySelectorAll(".tag-link");
    links.forEach((link) => link.classList.remove("tag-active"));

    // Add the 'tag-active' class to the clicked tag link
    e.target.classList.add("tag-active");
  };

  // create tag elements
  const tagElements = sortedTags.map((tag, i) => (
    <p
      data-value={tag}
      className={`tag-link ${tagsFilter === tag ? "tag-active" : ""}`}
      key={i}
      onClick={handleClick}
      id={i}
    >
      {tag}
    </p>
  ));

  return (
    <>
      <div className="category-container">
        <div className="select-tags-container">{tagElements}</div>
        <div className="posts-grid">{postElements}</div>
      </div>
    </>
  );
}
