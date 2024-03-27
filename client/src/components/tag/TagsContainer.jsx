import React, { useMemo } from "react";
import { useSelector } from "react-redux";

const TagsContainer = ({ activeTag, handleSelectTag }) => {
  const currentCategory = useSelector(state => state.posts.currentCategory)
  const tags = useSelector(state => state.tags.categoryTags[currentCategory])

  const sortedTags = useMemo(() => {
    const stringTags = [...new Set(tags)]
      .filter(tag => tag.match(/[^\d\W]\w*/))
      .sort((a, b) => a.localeCompare(b));
      // .sort();

    const numericTags = [...new Set(tags)]
      .filter(tag => tag.match(/^[0-9]/))
      .sort((a, b) => b - a);

    return stringTags.concat(numericTags);
  }, [tags]);

  return sortedTags.map((tag, i) => (
    <p
      key={i}
      data-testid="tagTest"
      data-value={tag}
      className={`tag-link ${activeTag === tag ? "is-selected" : ""}`}
      onClick={handleSelectTag}
    >
      {tag}
    </p>
  ));
};

export default TagsContainer;
