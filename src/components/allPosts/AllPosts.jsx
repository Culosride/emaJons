import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux"; // hook to select data from redux store
import { setCurrentCategory } from "../../features/posts/postsSlice";
import { fetchAllTags } from "../../features/tags/tagsSlice";
import { useParams } from "react-router-dom";
import ImageContainer from "../image/ImageContainer";
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
  const [tagsFilter, setTagsFilter] = useState([]);

  let postElements = [];

  useEffect(() => {
    const filtered = tagsFilter
      ? postsByCategory.filter((post) =>
          post.postTags.includes(tagsFilter)
        )
      : postsByCategory;

    setFilteredPosts(filtered);
  }, [tagsFilter]);

  const displayPosts = (posts) => {
    return posts.map((post) => {
      const { mediaType, url } = post.media[0];

      const getPreviewURL = () => {
        if (mediaType === "video") {
          return post.media[0].preview
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
            linkUrl={`/${params.category}/${post._id}`}
            src={getPreviewURL()}
            alt={post.title}
            hoverContent={post.title.split(",").join("").toUpperCase()}
          />
        )
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
  <a
    data-value={tag}
    className={`tag-link ${tagsFilter === tag ? 'tag-active' : ''}`}
    key={i}
    onClick={handleClick}
    id={i}
    href="#"
  >
    {tag}
  </a>
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
