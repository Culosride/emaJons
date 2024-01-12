import React from "react";

const TagsContainer = ({ sortedTags, activeTag, handleSelectTag }) => {
  return sortedTags.map((tag, i) => (
    <p
      key={i}
      data-value={tag}
      className={`tag-link ${activeTag === tag ? "tag-active" : ""}`}
      onMouseUp={handleSelectTag}
    >
      {tag}
    </p>
  ));
};

export default TagsContainer;
