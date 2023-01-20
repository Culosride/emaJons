import React, { useState, useEffect } from "react";
import { useNavigate, useParams, matchPath, useLocation } from 'react-router-dom';
import { createPost, editPost } from "../../features/posts/postsSlice"
import { deleteTag, fetchAllTags, addNewTag, toggleTag } from "../../features/categories/categorySlice"
import { selectAuthStatus } from "../../features/auth/authSlice"
import { useSelector, useDispatch } from "react-redux";
import Tag from "../tag/Tag";
const _ = require("lodash")

export default function PostForm () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { pathname } = useLocation()
  const currentPost = useSelector(state => state.posts.selectedPost)
  const postId = currentPost._id
  const availableTags = useSelector(state => state.categories.availableTags);
  const selectedTags = useSelector(state => state.categories.selectedTags);
  const error = useSelector(state => state.categories.error);
  const status = useSelector(state => state.categories.status);
  const [isLocationEdit, setIsLocationEdit] = useState()
  const [tag, setTag] = useState("");
  const [emptyCategory, setEmptyCategory] = useState(false);
  const [postData, setPostData] = useState({
    title: currentPost.title,
    subtitle: currentPost.subtitle,
    content: currentPost.content,
    images: [],
    category: currentPost.category,
    postTags: []
  });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllTags())
      setIsLocationEdit(matchPath("/posts/:postId/edit", pathname) ? true : false)
    }
    if(currentPost) {
      currentPost.postTags.forEach(tag => {
      dispatch(toggleTag(tag))})
    }
  }, [dispatch, status])

  function createNewTag() {
    dispatch(addNewTag(tag)) &&
    setTag("")
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

  function handleChange(e) {
    const { name, value, files } = e.target;
    setPostData(prev => {
      if (name === "images") {
        return ({ ...prev, images: [...prev.images, ...files] })
      } else if (name === "postTags") {
        return ({ ...prev, postTags: [...prev.postTags, value] })
      } else {
        return ({ ...prev, [name]: value })
      }
    });
  }

  function handleTag(e) {
    const { name, value } = e.target;

    if(name === "tag") {setTag(() => {
      return value
    })}
  }

  const submitBtn = () => {
    return isLocationEdit ? "Save changes " : "Create new post"
  }

  const handleSubmit = async (e) => {
    console.log("submitting")
    e.preventDefault()
    if(!postData.category) {
      setEmptyCategory(true);
      return
    }
    const formData = new FormData()
    Object.keys(postData).map((key) => {
      if (key === "images") {
        return postData.images.map(img => formData.append("images", img))
      } else if (key === "postTags") {
        return selectedTags.map(postTag => formData.append("postTags", postTag))
      } else {
        return formData.append(key, postData[key]);
      }
    });
    console.log(formData)
    dispatch(createPost(formData))
      .then((res) => { if(!res.error) {
        navigate(`/${postData.category}/${res.payload._id}`)
    }})
  }

  function handleEdit(e) {
    console.log(postData, selectedTags)
    e.preventDefault()
    if(!postData.category) {
      setEmptyCategory(true);
      return
    }
    const formData = new FormData()
    Object.keys(postData).map((key) => {
      if (key === "images") {
        return postData.images.map(img => formData.append("images", img))
      } else if (key === "postTags") {
        return selectedTags.map(postTag => formData.append("postTags", postTag))
      } else {
        return formData.append(key, postData[key]);
      }
    });

    dispatch(editPost({formData, postId}))
      .then((res) => { if(!res.error) {
        navigate(`/${postData.category}/${res.payload._id}`)
    }})
  }


  const tagElements = availableTags.map((t, i) => {
    if(t.startsWith(_.capitalize(tag))) {
      return <Tag handleTagToggle={handleTagToggle} selected={false} handleTagDelete={handleTagDelete} name={t} id={`${t}-${i}`} key={`${t}-${i}`}/>
    }
  })

  const selectedTagElements = selectedTags.map((t, i) => {
    return <Tag handleTagToggle={handleTagToggle} selected={true} handleTagDelete={handleTagDelete} name={t} id={`${t}-${i}`} key={`${t}-${i}`}/>
  })

  return (
    <div className="form-wrapper">
      <form className="post-form" onSubmit={isLocationEdit ? handleEdit : handleSubmit}>
        {/* <label className="">TITLE</label> */}
        <input className="form-post-title" type="text" placeholder= "UNTITLED" value={postData.title} name="title" onChange={handleChange} />

        {/* <label className="form-post-subtitle">Subtitle</label> */}
        <input type="text" className="form-post-subtitle" placeholder="subtitle" value={postData.subtitle} name="subtitle" onChange={handleChange}/>

        {/* <label>Content</label> */}
        <textarea className="form-post-content" rows="8" placeholder="Add content here....." value={postData.content} name="content" onChange={handleChange}/>

        <label htmlFor="categories">Category:</label>
        <select name="category" id="categories" onChange={handleChange}>
          <option value="">-- Please choose a category --</option>
          <option value="Walls">Walls</option>
          <option value="Paintings">Paintings</option>
          <option value="Sketchbooks">Skethbooks</option>
          <option value="Video">Video</option>
          <option value="Sculptures">Sculptures</option>
        </select>
        {emptyCategory && <p>Devi pigliarne una</p>}
        <div className="selected-tags-wrapper">
          {selectedTagElements}
        </div>
        <div className="tags-container">
          <div className="available-tags-wrapper">
            {tagElements}
          </div>
          <input type="text" onKeyDown={handleKeyDown} value={tag} placeholder="New tag" name="tag" onChange={handleTag} className="" />
          {/* {error && <p>{error}</p>} */}
        </div>

        <input className="form-post-imgs" type="file" onChange={handleChange} name="images" multiple />

        <input type="submit" value={submitBtn()} />
      </form>
      {/* {logoutButton} */}
    </div>
  )
}
