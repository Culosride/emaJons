import React, { useCallback, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // hook to select data from redux store
import { setCurrentCategory, setScrollPosition } from "../../features/posts/postsSlice";
import { selectTag } from "../../features/tags/tagsSlice";
import ImageContainer from "../image/ImageContainer";
import usePosts from "../../hooks/usePosts";
const _ = require("lodash");

export default function AllPosts() {
  const dispatch = useDispatch();
  const params = useParams();
  const currentCategory = params.category

  const status = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);
  const posts = useSelector((state) => state.posts.posts);
  const hasMorePosts = useSelector((state) => state.posts.loadMore);
  const scrollPosition = useSelector((state) => state.posts.scrollPosition);
  const activeTag = useSelector(state => state.tags.activeTag)

  const postsByCategory = posts.filter(post => post.category === _.capitalize(currentCategory));
  const [filteredPosts, setFilteredPosts] = useState(postsByCategory);

  const allTags = postsByCategory.flatMap(post => post.postTags.map((tag) => tag));
  const sortedTags = [...new Set(allTags.sort((a, b) => b.localeCompare(a)))];

  const { setPageNum } = usePosts(currentCategory);

  useEffect(() => {
    dispatch(setCurrentCategory(currentCategory));
    window.scrollTo(0, scrollPosition)
  }, [])

  // toggle header
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const headerRef = document.querySelector(".header-100")
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 40 ) return headerRef.classList.remove('fade-top')

      if (currentScrollY > lastScrollY) {
        headerRef.classList.add('fade-top')
      } else {
        headerRef.classList.remove('fade-top')
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  let postElements = [];

  useEffect(() => {
    const filtered = activeTag
    ? postsByCategory.filter((post) => post.postTags.includes(activeTag))
    : postsByCategory;
    setFilteredPosts(filtered);
  }, [activeTag, posts]);

  const handleScrollPosition = () => {
    dispatch(setScrollPosition(window.scrollY))
  }

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
            ref={((i === posts.length - 1) && lastPostRef) || undefined}
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

  // interception observers references
  const firstPostObserver = useRef();

  // loads more posts (infinite scroll)
  const lastPostRef = useCallback((post) => {
    if (status !== "succeeded") return;
    if (firstPostObserver.current) firstPostObserver.current.disconnect();
    firstPostObserver.current = new IntersectionObserver(
      (entries) => {
        if(entries[0].isIntersecting && hasMorePosts) {
          setPageNum((p) => p + 1);
        }
      }, { threshold: 0.8 }
      );
      if (post) firstPostObserver.current.observe(post);
  }, [status, hasMorePosts, activeTag]);

  // filter posts on tag click
  const handleSelectTag = (e) => {
    e.preventDefault();
    const selectedTag = e.target.getAttribute("data-value");

    if (activeTag === selectedTag) {
      dispatch(selectTag(""))
    } else {
      dispatch(selectTag(selectedTag))
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
      onClick={handleSelectTag}
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
      {(status === "failed") && <div className="">{error}</div>}
      <div className="posts-container">
        <div className="select-tags-container">{tagElements}</div>
        <div className="posts-grid">{postElements}</div>
      </div>
      {(status === "loading") && <div className="loading-spinner">Loading more posts</div>}
    </>
  )
}
