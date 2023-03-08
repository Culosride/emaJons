import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux"; // hook to select data from redux store
import { setCurrentCategory } from "../../features/posts/postsSlice";
import { fetchAllTags } from "../../features/tags/tagsSlice";
import { Link, useParams } from "react-router-dom";
const _ = require("lodash");

export default function AllPosts() {
  const params = useParams();
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const postsByCategory = posts.filter(
    (post) => post.category === _.capitalize(params.category)
  );
  let status = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);
  const allTags = postsByCategory.flatMap((post) =>
    post.postTags.map((tag) => tag)
  );

  const sortedTags = [...new Set(allTags.sort((a, b) => b.localeCompare(a)))];
  const [filteredPosts, setFilteredPosts] = useState(postsByCategory);
  const [tagsFilter, setTagsFilter] = useState([])

  console.log("filter", tagsFilter)

  let postElements = [];

  useEffect(() => {
    const filtered = postsByCategory.filter((post) => {
      // console.log("ss",post.postTags)
      return tagsFilter.every((tag) => post.postTags.includes(tag));
      });

    filtered.length && setFilteredPosts(filtered) ||
    !filtered.length && setFilteredPosts(postsByCategory)
    console.log(filteredPosts)
  }, [tagsFilter]);

  const [hoveredPost, setHoveredPost] = useState(null);
  const handleMouseEnter = (postId) => {
    setHoveredPost(postId);
  };
  const handleMouseLeave = () => {
    setHoveredPost(null);
  };

  const displayPosts = (posts) => {
    return posts.map((post, i) => {
      return (
        <Link
          reloadDocument
          to={`/${params.category}/${post._id}`}
          id={post._id}
          key={post._id}
        >
          {post.media.length ? (
            <>
              <img
                className="allposts-img"
                onMouseEnter={() => handleMouseEnter(post._id)}
                onMouseLeave={handleMouseLeave}
                key={i}
                src={post.media[0].url}
              />
              <div>
                {post.postTags}
              </div>
              {hoveredPost === post._id && (
                <div className="post-info">
                  <p>{post.title.split(",").join("").toUpperCase()}</p>
                </div>
              )}
            </>
          ) : (
            <p key={i}>{post.title}</p>
          )}
        </Link>
      );
    });
  };

  useEffect(() => {
    dispatch(setCurrentCategory(params.category));
    dispatch(fetchAllTags());
  }, [params]);

  if (status === "failed") {
    postElements = <p>{error}</p>;
  } else if (status === "loading") {
    postElements = <p>Loading..</p>;
  } else if (status === "succeeded") {
    postElements =
      (filteredPosts.message && filteredPosts.message) ||
      (filteredPosts.length && displayPosts(filteredPosts)) ||
      displayPosts(postsByCategory);
  }

  // filter posts on tag click
  const handleClick = (e) => {
    e.preventDefault();
    const filter = e.target.getAttribute("data-value");
    console.log("filter", filter)
    if(tagsFilter.includes(filter)) {
      setTagsFilter(prev => prev.filter(tag => tag !== filter))
    } else {
      setTagsFilter(prev => [...prev, filter])
    }

    const links = document.querySelectorAll(".tag-link");

    if (links[e.target.id].className.includes("active")) {
      links[e.target.id].classList.remove("tag-active");
    } else {
      links[e.target.id].classList.add("tag-active");
    }
  };

  // create tag elements
  const tagElements = sortedTags.map((tag, i) => (
    <a
      data-value={tag}
      className="tag-link"
      key={i}
      onClick={handleClick}
      id={i}
      href="#"
    >
      {tag}
    </a>
  ));

  return (
    <div>
      <div className="category-container">
        <div className="select-tags-container">{tagElements}</div>
        <div className="posts-grid">{postElements}</div>
      </div>
    </div>
  );
}
