import React, { useMemo } from "react";
import { useSelector } from "react-redux";

const TagsContainer = ({ activeTag, handleSelectTag }) => {
  const currentCategory = useSelector(state => state.posts.currentCategory)
  const tags = useSelector(state => state.tags.categoryTags[currentCategory])

  const sortedTags = useMemo(() => {
    return [...new Set(tags)].sort((a, b) => b.localeCompare(a));
  }, [tags]);

  return sortedTags.map((tag, i) => (
    <p
      key={i}
      data-value={tag}
      className={`tag-link ${activeTag === tag ? "is-selected" : ""}`}
      onClick={handleSelectTag}
    >
      {tag}
    </p>
  ));
};

export default TagsContainer;
