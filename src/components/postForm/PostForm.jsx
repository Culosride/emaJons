import React, { useState, useEffect, useRef } from "react";
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
  const error = useSelector(state => state.categories.error);
  const status = useSelector(state => state.categories.status);
  const editPage = pathname.includes("edit")
  const [tag, setTag] = useState("");
  const [emptyCategory, setEmptyCategory] = useState(false);
  const [postData, setPostData] = useState({
      title: "",
      subtitle: "",
      content: "",
      images: [],
      category: "",
      postTags: []
    }
  );
  const imageContainerRef = useRef();
  const categories = ['Walls', 'Paintings', 'Sketchbooks', 'Video', 'Sculptures']

  useEffect(() => {
    if(status === 'idle') {
      dispatch(fetchAllTags())
    } else if(status === "succeeded" && editPage) {
      setPostData({
        title: currentPost.title,
        subtitle: currentPost.subtitle,
        content: currentPost.content,
        images: [],
        category: currentPost.category,
        postTags: []
      });
      currentPost.postTags.forEach(tag => {
        dispatch(toggleTag(tag))})
      } else if(!editPage) {
        setPostData({
          title: "",
          subtitle: "",
          content: "",
          images: [],
          category: "",
          postTags: []
        })
        dispatch(resetTags())
      }
  }, [dispatch, pathname, status])



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

  function handlePreview(e) {
    if(e.target.files.length > 0){
      const files = e.target.files;
      Array.from(files).map(file => {
        const src = URL.createObjectURL(file);
        const imageElement = `<div class="preview-images"><img src=${src} /></div>`
        imageContainerRef.current.insertAdjacentHTML('beforeend', imageElement)
      })
    }
  }

  function handleChangeAndPreview(e) {
    handleChange(e)
    handlePreview(e)
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
    // persistor.purge(["posts"])
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

  // const optionElements = categories.filter(category => category !== postData.category)
  //                                  .map((element, i) => { return <option key={element+i} value={element}>{element}</option> })

  return (
    <div className="form-wrapper">
      <form className="post-form" onSubmit={editPage ? handleEdit : handleSubmit}>

        <div className="post-form-layout">
          <input className="form-post-imgs" type="file" onChange={handleChangeAndPreview} name="images" multiple />
          <div className="image-preview-container" ref={imageContainerRef}>
          </div>
        </div>

        <div className="post-form-layout">
          <fieldset>
            <input
              className='title'
              type="text" placeholder="ADD A TITLE"
              value={postData.title} name="title"
              onChange={handleChange}
            />

            <input
              type="text"
              className="subtitle"
              placeholder="Add a subtitle"
              value={postData.subtitle}
              name="subtitle"
              onChange={handleChange}
            />

            <textarea
              className="content"
              rows="6"
              placeholder="Add content ..."
              value={postData.content}
              name="content"
              onChange={handleChange}
            />
            <hr />
            {/* <label>Category</label> */}
            <select name="category" id="categories" onChange={handleChange}>
              {editPage && <option value="">{postData.category}</option>}
              {!editPage && <option value="">Please choose a category</option>}
              {/* {optionElements} */}
              <option value="Walls">Walls</option>
              <option value="Paintings">Paintings</option>
              <option value="Sketchbooks">Sketchbooks</option>
              <option value="Video">Video</option>
              <option value="Sculpture">Sculpture</option>
            </select>

            {emptyCategory && <p>Devi pigliarne una</p>}
          </fieldset>

          <fieldset className="tags-container">
            {/* <label>Add some tags</label> */}
            <input type="text" onKeyDown={handleKeyDown} value={tag} placeholder="Search tags or add a new tag" name="tag" onChange={handleTag} className="search-tags" />
            <fieldset className="selected-tags-wrapper">
              <p className="form-description">Selected tags</p>
              {selectedTagElements.length ? selectedTagElements : <div className="ghost-tag"><p className="tag">No tags selected</p></div>}
            </fieldset>
            <p className="form-description">Available tags</p>
            <div className="available-tags-wrapper">
              {tagElements}
            </div>
            {/* {error && <p>{error}</p>} */}
          </fieldset>

          <input className="btn-submit" type="submit" value={submitBtn()} />
        </div>

      </form>
      {/* {logoutButton} */}
    </div>
  )
}
