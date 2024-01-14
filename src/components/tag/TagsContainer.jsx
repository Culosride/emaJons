import React from "react";

const TagsContainer = ({ sortedTags, activeTag, handleSelectTag }) => {
  return sortedTags.map((tag, i) => (
    <p
      key={i}
      data-value={tag}
      className={`tag-link ${activeTag === tag ? "is-selected" : ""}`}
      onMouseUp={handleSelectTag}
    >
      {tag}
    </p>
  ));
};

export default TagsContainer;
