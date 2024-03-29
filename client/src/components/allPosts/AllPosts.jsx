import React, { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setScrollPosition } from "../../features/UI/uiSlice";
import { selectTag } from "../../features/tags/tagsSlice";
import PostPreview from "../post/PostPreview";
import usePosts from "../../hooks/usePosts";
import { useScroll } from "../../hooks/useScroll";
import useScreenSize from "../../hooks/useScreenSize";
import Draggable from "../UI/Draggable";
import ErrorMsg from "../UI/ErrorMsg";
import { POSTS_TO_LOAD } from "../../config/roles";
import TagsContainer from "../tag/TagsContainer";
import _ from 'lodash';

export default function AllPosts() {
  const dispatch = useDispatch();
  const { category } = useParams()

  const status = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);
  const posts = useSelector((state) => state.posts.posts);
  const hasMorePosts = useSelector((state) => state.posts.loadMore[category]);
  const activeTag = useSelector((state) => state.tags.activeTag);

  const scrollPosition = useSelector((state) => state.ui.scrollPosition);
  const isMediumScreen = useScreenSize(["xs", "s", "m"])

  useEffect(() => {
    window.scrollTo(0, scrollPosition);
  }, [])

  const postsByCategory = useMemo(() => {
    const sortedPosts = [...posts].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return sortedPosts.filter(post => post.category === _.capitalize(category));
  }, [posts, category]);

  const [filteredPosts, setFilteredPosts] = useState(postsByCategory);

  const observer = useRef(null);
  const maskTagsRef = useRef(null);
  const tagsContainerRef = useRef(null);

  const { setPageNum } = usePosts(category, postsByCategory.length);

  useScroll(tagsContainerRef, undefined, { threshold: 40, scrollClass: "fade-top" });

  let postElements = [];

  useEffect(() => {
    const filtered = activeTag
      ? postsByCategory.filter((post) => post.postTags.includes(activeTag))
      : postsByCategory;

      if (filtered.length < POSTS_TO_LOAD && activeTag && hasMorePosts) {
        setPageNum((pageNum) => pageNum + 1);
      }

    // If no posts for the activeTag filter, render all the posts
    setFilteredPosts(filtered.length ? filtered : postsByCategory);
  }, [activeTag, posts]);

  const handleClick = () => {
    dispatch(setScrollPosition(window.scrollY));
  };

  // Loads more posts (infinite scroll)
  const lastPostRef = useCallback((post) => {
    if (status === "loading") return;
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

  const displayPosts = useMemo(() => {
    if (filteredPosts.length < 1) return <p style={{textWrap: "nowrap"}}>EmaJons is too shy to show his {category.toLowerCase()}.</p>;

    return filteredPosts.map((post, i) => {
      const { mediaType, url } = post.media[0];
      const previewURL = mediaType === "video" ? post.media[0].preview : url;

      return (
        post.media.length > 0 && (
          <PostPreview
            key={post._id}
            mediaType={post.media[0].mediaType}
            id={post._id}
            ref={(i === filteredPosts.length - 1 && lastPostRef) || undefined}
            linkUrl={`/${category}/${post._id}`}
            src={previewURL}
            handleClick={handleClick}
            alt={post.title}
            hoverContent={post.title.split(",").join("").toUpperCase()}
          />
        )
      );
    });
  }, [filteredPosts, category, lastPostRef, handleClick]);

  // Filter posts on tag click
  const handleSelectTag = (e) => {
    window.scrollTo(0, 0);

    const selectedTag = e.target.getAttribute("data-value");
    isMediumScreen && centerTag(e.target);

    if (activeTag === selectedTag) {
      dispatch(selectTag(""));
    } else {
      dispatch(selectTag(selectedTag));
    }

    updateTagsClass(e.target);
  };

  const centerTag = (element) => {
    const container = maskTagsRef.current;
    const containerCenter = container.clientWidth / 2;
    const elementWidth = element.clientWidth;
    const elementRight = element.getBoundingClientRect().right;
    const elementCenterfromLeft = elementRight - elementWidth / 2;

    const newScrollLeft =
      container.scrollLeft + elementCenterfromLeft - containerCenter;

    container.scrollLeft = newScrollLeft;
  };

  const updateTagsClass = (activeElement) => {
    // Deselects all tag links
    const links = document.querySelectorAll(".tag-link");
    links.forEach((link) => link.classList.remove("is-selected"));
    // Selects clicked tag link
    activeElement.classList.add("is-selected");
  };

  postElements =
    (filteredPosts.length && displayPosts) ||
    displayPosts;

  return (
    <>
      {status === "failed" && <ErrorMsg errMsg={error} />}
      <main className="posts-container">
        <div ref={tagsContainerRef} className="select-tags-container">
          <Draggable userRef={maskTagsRef} className="mask">
            <TagsContainer
              activeTag={activeTag}
              handleSelectTag={handleSelectTag}
            />
          </Draggable>
        </div>
        <div className="posts-grid">{postElements}</div>
      </main>
      {status === "loading" && (
        <div className="loading-spinner">Loading more posts...</div>
      )}
    </>
  );
}
