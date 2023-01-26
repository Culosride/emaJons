import React, { useState, useEffect } from "react";
import { useNavigate, useParams, matchPath, useLocation } from 'react-router-dom';
import { createPost, editPost } from "../../features/posts/postsSlice"
import { deleteTag, fetchAllTags, addNewTag, toggleTag, resetTags } from "../../features/categories/categorySlice"
import { selectAuthStatus } from "../../features/auth/authSlice"
import { useSelector, useDispatch } from "react-redux";
import Tag from "../tag/Tag";
import { persistor } from "../../app/store";
const _ = require("lodash")

export default function PostForm () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { pathname } = useLocation()
  const currentPost = useSelector(state => state.posts.selectedPost)
  const postId = currentPost._id
  const availableTags = useSelector(state => state.categories.availableTags);
  let selectedTags = useSelector(state => state.categories.selectedTags);
  // const error = useSelector(state => state.categories.error);
  const status = useSelector(state => state.categories.status);
  const editPage = pathname.includes("edit")
  const [tag, setTag] = useState("");
  const [error, setError] = useState(null);
  const [postData, setPostData] = useState({
      title: "",
      subtitle: "",
      content: "",
      media: [],
      category: "",
      postTags: []
    }
  );
  const categories = ['Walls', 'Paintings', 'Sketchbooks', 'Video', 'Sculptures']

  useEffect(() => {
    dispatch(resetTags())
    dispatch(fetchAllTags())
    if(editPage) {
      currentPost.postTags.forEach(tag => {
        dispatch(toggleTag(tag))})
      setPostData(
        {
          title: currentPost.title,
          subtitle: currentPost.subtitle,
          content: currentPost.content,
          media: [],
          category: currentPost.category,
          postTags: []
        }
      )
    } else if(!editPage){
      dispatch(resetTags())
      dispatch(fetchAllTags())
      setPostData(
        {
          title: "",
          subtitle: "",
          content: "",
          media: [],
          category: "",
          postTags: []
        }
        )
    }
  }, [pathname])

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
    setError("")
    const { name, value, files } = e.target;
    setPostData(prev => {
      if (name === "media") {
        return ({ ...prev, media: [...prev.media, ...files] })
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
    return editPage ? "Save changes " : "Create new post"
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!postData.category) {
      setError("Select a category");
      return
    } else if (!postData.media.length) {
      setError("A post with no pictures?");
      return
    }
    const formData = new FormData()
    Object.keys(postData).map((key) => {
      if (key === "media") {
        return postData.media.map(med => formData.append("media", med))
      } else if (key === "postTags") {
        return selectedTags.map(postTag => formData.append("postTags", postTag))
      } else {
        return formData.append(key, postData[key]);
      }
    });
    dispatch(createPost(formData))
      .then((res) => { if(!res.error) {
        navigate(`/${postData.category}/${res.payload._id}`)
      }})
  }
  function handleEdit(e) {
    e.preventDefault()
    if(!postData.category) {
      setEmptyCategory(true);
      return
    }
    const formData = new FormData()
    Object.keys(postData).map((key) => {
      if (key === "media") {
        return postData.media.map(img => formData.append("media", img))
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

  const optionElements = categories.filter(category => category !== postData.category)
                          .map((element, i) => { return <option key={element+i} value={element}>{element}</option> })

  return (
    <div className="form-wrapper">
      {error && <p className="error-msg">{error}</p>}
      <form className="post-form" onSubmit={editPage ? handleEdit : handleSubmit}>
        <label className="">TITLE</label>
        <input className="form-post-title" type="text" placeholder= "UNTITLED" value={postData.title} name="title" onChange={handleChange} />

        <label className="form-post-subtitle">Subtitle</label>
        <input type="text" className="form-post-subtitle" placeholder="subtitle" value={postData.subtitle} name="subtitle" onChange={handleChange}/>

        <label>Content</label>
        <textarea className="form-post-content" rows="8" placeholder="Add content here....." value={postData.content} name="content" onChange={handleChange}/>

        <label htmlFor="categories">Category:</label>
        <select name="category" id="categories" onChange={handleChange}>
          {/* {editPage && <option value="">{postData.category}</option>}
          {!editPage && <option value="">-- Please choose a category --</option>} */}
          {/* {optionElements} */}
          <option value="">-- Please choose a category --</option>
          <option value="Walls">Walls</option>
          <option value="Paintings">Paintings</option>
          <option value="Sketchbooks">Skethbooks</option>
          <option value="Video">Video</option>
          <option value="Sculpture">Sculpture</option>
        </select>
        {error && <p>Devi pigliarne una</p>}
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

        <input className="form-post-imgs" type="file" onChange={handleChange} name="media" multiple />

        <input type="submit" value={submitBtn()} />
      </form>
      {/* {logoutButton} */}
    </div>
  )
}
