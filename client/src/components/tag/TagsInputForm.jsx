import React, { useRef, useState } from "react";
import Tag from "./Tag";
import { deleteTag, createTag, toggleTag, fetchTags } from "../../features/tags/tagsSlice";
import { useSelector, useDispatch } from "react-redux";
import { setModal } from "../../features/UI/uiSlice";
import Modal from "../UI/Modal";
import useKeyPress from "../../hooks/useKeyPress";
import { fetchPostsByCategory } from "../../features/posts/postsSlice";

const TagsInputForm = () => {
  const dispatch = useDispatch();
  const [tag, setTag] = useState("");
  const selectedTags = useSelector((state) => state.tags.selectedTags);
  const currentCategory = useSelector((state) => state.posts.currentCategory);
  const availableTags = useSelector((state) => state.tags.availableTags);
  const modals = useSelector((state) => state.ui.modals);
  const [tagToDelete, setTagToDelete] = useState("");

  const inputRef = useRef(null)

  useKeyPress("Escape", () =>
    dispatch(setModal({ key: "tagDelete", state: false }))
  );

  const createNewTag = () => {
    if (selectedTags.includes(tag)) {
      setTag("");
    } else if (availableTags.includes(tag)) {
      dispatch(toggleTag(tag));
    } else {
      dispatch(createTag(tag));
    }
    setTag("");
  };


  const handleTagDelete = (tag) => {
    dispatch(setModal({ key: "tagDelete", state: true }));
    setTagToDelete(tag);
  };

  const confirmTagDelete = () => {
    dispatch(deleteTag(tagToDelete));
    dispatch(setModal({ key: "tagDelete", state: false }));
    dispatch(fetchPostsByCategory({ currentCategory, pageNum: 1 }));
    dispatch(fetchTags())
  };

  const handleTagToggle = (tag) => {
    dispatch(toggleTag(tag));
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
  const tagElements = [...availableTags]
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
        />
      )}
    </fieldset>
  );
};

export default TagsInputForm;
