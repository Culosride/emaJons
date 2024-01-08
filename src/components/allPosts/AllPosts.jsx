import React, { useCallback, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // hook to select data from redux store
import { setCurrentCategory } from "../../features/posts/postsSlice";
import { setScrollPosition } from "../../features/UI/uiSlice";
import { selectTag } from "../../features/tags/tagsSlice";
import ImageContainer from "../image/ImageContainer";
import usePosts from "../../hooks/usePosts";
import { useScroll } from "../../hooks/useScroll";
import Draggable from "../UI/Draggable";
import ErrorMsg from "../UI/ErrorMsg";
import { POSTS_TO_LOAD } from "../../config/roles";
const _ = require("lodash");

export default function AllPosts() {
  const dispatch = useDispatch();
  const params = useParams();
  const currentCategory = params.category;

  const status = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);
  const posts = useSelector((state) => state.posts.posts);
  const hasMorePosts = useSelector((state) => state.posts.loadMore);
  const scrollPosition = useSelector((state) => state.ui.scrollPosition);
  const activeTag = useSelector((state) => state.tags.activeTag);
  const screenSize = useSelector((state) => state.ui.screenSize);
  const isSmallScreen = ["xs", "s"].includes(screenSize);

  const postsByCategory = posts.filter(
    (post) => post.category === _.capitalize(currentCategory)
  );
  const [filteredPosts, setFilteredPosts] = useState(postsByCategory);

  const allTags = postsByCategory.flatMap((post) =>
    post.postTags.map((tag) => tag)
  );
  const sortedTags = [...new Set(allTags.sort((a, b) => b.localeCompare(a)))];

  const observer = useRef(null);
  const maskTagsRef = useRef(null);
  const tagsContainerRef = useRef(null);

  const { setPageNum } = usePosts(currentCategory);

  useEffect(() => {
    dispatch(setCurrentCategory(currentCategory));
    window.scrollTo(0, scrollPosition);
  }, []);

  useEffect(() => {
    if (filteredPosts.length < POSTS_TO_LOAD && activeTag && hasMorePosts)
      setPageNum(2);
  }, [filteredPosts]);

  useScroll(tagsContainerRef, _, { threshold: 40, scrollClass: "fade-top" });

  let postElements = [];

  useEffect(() => {
    const filtered = activeTag
      ? postsByCategory.filter((post) => post.postTags.includes(activeTag))
      : postsByCategory;
    setFilteredPosts(filtered);
  }, [activeTag, posts]);

  const handleScrollPosition = () => {
    dispatch(setScrollPosition(window.scrollY));
  };

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
            ref={(i === posts.length - 1 && lastPostRef) || undefined}
            linkUrl={`/${currentCategory}/${post._id}`}
            src={getPreviewURL()}
            handleScrollPosition={handleScrollPosition}
            alt={post.title}
            hoverContent={post.title.split(",").join("").toUpperCase()}
          />
        )
      );
    });
  };

  // loads more posts (infinite scroll)
  const lastPostRef = useCallback((post) => {
    if (status !== "succeeded") return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(
      (entries) => {
        if(entries[0].isIntersecting && hasMorePosts) {
          setPageNum((p) => p + 1);
        }
      }, { threshold: 0.8 }
      );
      if (post) observer.current.observe(post);
  }, [status, hasMorePosts, activeTag]);

  const centerTag = (e) => {
    const container = maskTagsRef.current;
    const element = e.target;
    const containerCenter = container.clientWidth / 2;
    const elementWidth = element.clientWidth;
    const elementRight = element.getBoundingClientRect().right;
    const elementCenterfromLeft = elementRight - elementWidth / 2;

    const newScrollLeft =
      container.scrollLeft + elementCenterfromLeft - containerCenter;

    container.scrollLeft = newScrollLeft;
  };

  // filter posts on tag click
  const handleSelectTag = (e) => {
    window.scrollTo(0, 0);

    isSmallScreen && centerTag(e);
    const selectedTag = e.target.getAttribute("data-value");

    if (activeTag === selectedTag) {
      dispatch(selectTag(""));
    } else {
      dispatch(selectTag(selectedTag));
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
      className={`tag-link ${activeTag === tag ? "tag-active" : ""}`}
      key={i}
      onMouseUp={handleSelectTag}
      id={i}
    >
      {tag}
    </p>
  ));

  postElements =
    (filteredPosts.message && filteredPosts.message) ||
    (filteredPosts.length && displayPosts(filteredPosts)) ||
    displayPosts(postsByCategory);

  return (
    <>
      {status === "failed" && <ErrorMsg errMsg={error} />}
      <main className="posts-container">
        <div ref={tagsContainerRef} className="select-tags-container">
          <Draggable
            isSmallScreen={isSmallScreen}
            userRef={maskTagsRef}
            className="mask"
          >
            {tagElements}
          </Draggable>
        </div>
        <div className="posts-grid">{postElements}</div>
      </main>
      {status === "loading" && (
        <div className="loading-spinner">Loading more posts</div>
      )}
    </>
  );
}
