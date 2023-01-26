import React, { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
import Tag from "../tag/Tag";
import { deleteTag, fetchAllTags, addNewTag, toggleTag, resetTags } from "../../features/tags/tagsSlice"
import { useSelector, useDispatch } from "react-redux";

const TagsInputForm = () => {
  const dispatch = useDispatch();
  const [tag, setTag] = useState("");
  const { pathname } = useLocation()
  const editPage = pathname.includes("edit")
  let selectedTags = useSelector(state => state.tags.selectedTags);
  const availableTags = useSelector(state => state.tags.availableTags);

  // CRUD tags
  function createNewTag(e) {
    dispatch(addNewTag(tag))
    setTag("")
    // dispatch(toggleTag(tag))
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

  function handleTagToggle(tag) {
    dispatch(toggleTag(tag))
  }

  // set tag in useState
  function handleTag(e) {
    const { name, value } = e.target;
    if(name === "postTags") {setTag(() => {
      return value
    })}
  }

  // render Tag Elements
  const tagElements = availableTags.map(t => {
    if(t.name.startsWith(_.capitalize(tag))) {
      return <Tag handleTagToggle={handleTagToggle} selected={false} handleTagDelete={handleTagDelete} tag={t} id={t._id} key={t._id}/>
    }
  })

  const selectedTagElements = selectedTags.map((t, i) => {
    if(t.name.startsWith(_.capitalize(tag))) {
      return <Tag handleTagToggle={handleTagToggle} selected={true} handleTagDelete={handleTagDelete} tag={t} id={t._id} key={t._id}/>
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
