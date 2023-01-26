import React, { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
import Tag from "../tag/Tag";
import { deleteTag, fetchAllTags, addNewTag, toggleTag, resetTags } from "../../features/categories/categorySlice"
import { useSelector, useDispatch } from "react-redux";

const TagsInputForm = () => {
  const dispatch = useDispatch();
  const [tag, setTag] = useState("");
  const { pathname } = useLocation()
  const editPage = pathname.includes("edit")
  let selectedTags = useSelector(state => state.categories.selectedTags);
  const availableTags = useSelector(state => state.categories.availableTags);

  // CRUD tags
  function createNewTag(e) {
    dispatch(addNewTag(tag))
    setTag("")
    dispatch(toggleTag(tag))
  }

  function handleKeyDown(e) {
    if(e.keyCode === 9) {
      e.preventDefault();
      createNewTag()
    }
  }

  function handleTagDelete(tagName) {
    dispatch(deleteTag(tagName))
  }

  function handleTagToggle(tagName) {
    dispatch(toggleTag(tagName))
  }

  // set tag in useState
  function handleTag(e) {
    const { name, value } = e.target;
    if(name === "postTags") {setTag(() => {
      return value
    })}
  }

  // render Tag Elements
  const tagElements = availableTags.map((t, i) => {
    if(t.startsWith(_.capitalize(tag))) {
      return <Tag handleTagToggle={handleTagToggle} selected={false} handleTagDelete={handleTagDelete} name={t} id={`${t}-${i}`} key={`${t}-${i}`}/>
    }
  })

  const selectedTagElements = selectedTags.map((t, i) => {
    if(t.startsWith(_.capitalize(tag))) {
      return <Tag handleTagToggle={handleTagToggle} selected={true} handleTagDelete={handleTagDelete} name={t} id={`${t}-${i}`} key={`${t}-${i}`}/>
    }
  })

  return (
    <fieldset className="tags-container">
      <span className="tags-input-form">
        <input
          type="text"
          onKeyDown={handleKeyDown}
          value={tag}
          placeholder="Search tags or add a new tag"
          name="postTags"
          onChange={handleTag}
          className="search-tags"
        />
        {tag && <div className="add-new-tag" onClick={createNewTag}> + Add/Select</div>}
      </span>

      <fieldset className="selected-tags-wrapper">
        <p className="form-description">Selected tags</p>
        {selectedTagElements.length ? selectedTagElements : <div className="ghost-tag"><p className="tag">No tags selected</p></div>}
      </fieldset>

      <p className="form-description">Available tags</p>
      <fieldset className="available-tags-wrapper">
        {tagElements}
      </fieldset>
      {/* {error && <p>{error}</p>} */}
    </fieldset>
  )
}

export default TagsInputForm
