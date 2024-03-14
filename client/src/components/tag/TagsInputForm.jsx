import React, { useRef, useState } from "react";
import Tag from "./Tag";
import { deleteTag, createTag, fetchTags } from "../../features/tags/tagsSlice";
import { useSelector, useDispatch } from "react-redux";
import { setModal } from "../../features/UI/uiSlice";
import Modal from "../UI/Modal";
import useKeyPress from "../../hooks/useKeyPress";
import { fetchPostsByCategory } from "../../features/posts/postsSlice";
import _ from 'lodash';

const TagsInputForm = ({ selectedTags, setSelectedTags, unselectedTags, setUnselectedTags }) => {
  const dispatch = useDispatch();
  const [tag, setTag] = useState("");

  const currentCategory = useSelector((state) => state.posts.currentCategory);
  const modals = useSelector((state) => state.ui.modals);
  const tagStatus = useSelector((state) => state.tags.status)

  const [tagToDelete, setTagToDelete] = useState("");

  const inputRef = useRef(null)

  useKeyPress("Escape", () =>
    dispatch(setModal({ key: "tagDelete", state: false }))
  );

  const createNewTag = () => {
    if (tagStatus === "loading") return

    if (selectedTags.includes(tag) || unselectedTags.includes(tag)) {
      handleTagToggle(tag)
    } else {
      dispatch(createTag(tag));
      setSelectedTags(prev => [...prev, tag])
    }
    setTag("");
  };

  const handleTagDelete = (tag) => {
    dispatch(setModal({ key: "tagDelete", state: true }));
    setTagToDelete(tag);
  };

  const confirmTagDelete = async () => {
    if (tagStatus === "loading") return

    const filteredTags = filterTags(unselectedTags, tagToDelete)
    setUnselectedTags(filteredTags);

    await dispatch(deleteTag(tagToDelete));
    await dispatch(fetchPostsByCategory({ currentCategory, pageNum: 1 }));
    await dispatch(fetchTags())
    dispatch(setModal({ key: "tagDelete", state: false }));
  };

  const handleTagToggle = (tag) => {
    const isTagAvailable = unselectedTags.includes(tag);
    const newUnselectedTags = isTagAvailable
      ? filterTags(unselectedTags, tag)
      : [...unselectedTags, tag];
    const newSelectedTags = isTagAvailable
      ? [...selectedTags, tag]
      : filterTags(selectedTags, tag)

    setUnselectedTags(newUnselectedTags);
    setSelectedTags(newSelectedTags);
  };

  // Set tag in useState
  const handleTag = (e) => {
    const { name, value } = e.target;
    if (name === "postTags") {
      setTag(() => _.capitalize(value));
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Tab" || e.key === "Enter") {
      e.preventDefault();
      createNewTag();
      inputRef.current.focus()
    }
  }
  // Render Tag Elements
  const tagElements = [...unselectedTags]
    .sort((a, b) => a.localeCompare(b))
    .map((t, i) => {
      // Fix auto suggestion
      if (t.startsWith(_.capitalize(tag))) {
        return (
          <Tag
            handleTagToggle={handleTagToggle}
            selected={false}
            handleTagDelete={handleTagDelete}
            tag={t}
            id={`${t}-${i}`}
            key={`${t}-${i}`}
          />
        );
      }
    });

  const selectedTagElements = [...selectedTags]
    .sort((a, b) => a.localeCompare(b))
    .map((t, i) => {
      if (t.startsWith(_.capitalize(tag))) {
        return (
          <Tag
            handleTagToggle={handleTagToggle}
            selected={true}
            handleTagDelete={handleTagDelete}
            tag={t}
            id={`${t}-${i}`}
            key={`${t}-${i}`}
          />
        );
      }
    });

  function filterTags(tagArray, tagToFilter) {
    return tagArray.filter(tag => tag !== tagToFilter);
  }

  return (
    <fieldset className="tags-container">
      <span className="tags-input-form">
        <input
          type="text"
          value={tag}
          placeholder="Search tags or add a new tag"
          name="postTags"
          onChange={handleTag}
          onKeyDown={handleTagKeyDown}
          ref={inputRef}
          className="search-tags"
        />
        {tag &&
          <div className="add-new-tag" onClick={createNewTag}>
            + Add/Select
          </div>
        }
      </span>

      <fieldset className="selected-tags-wrapper">
        <p className="form-description">Selected tags</p>
        {selectedTagElements.length ? (
          selectedTagElements
        ) : (
          <div className="ghost-tag">
            <p className="tag">No tags selected</p>
          </div>
        )}
      </fieldset>

      <p className="form-description">Available tags</p>
      <fieldset className="available-tags-wrapper">{tagElements}</fieldset>
      {modals.tagDelete && (
        <Modal
          modalKey="tagDelete"
          description={`Globally delete the tag: ${tagToDelete}?`}
          confirmDelete={confirmTagDelete}
          isLoading={tagStatus === "loading"}
          loadingMessage={"Deleting tag.."}
        />
      )}
    </fieldset>
  );
};

export default TagsInputForm;
