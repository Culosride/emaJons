import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, matchPath, useLocation } from 'react-router-dom';
import { createPost, editPost } from "../../features/posts/postsSlice"
import { deleteTag, fetchAllTags, addNewTag, toggleTag, resetTags } from "../../features/tags/tagsSlice"
import { selectAuthStatus } from "../../features/auth/authSlice"
import { useSelector, useDispatch } from "react-redux";
// import Tag from "../tag/Tag";
import TagsInputForm from "../tag/TagsInputForm";
import { persistor } from "../../app/store";
const _ = require("lodash")

export default function PostForm () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { pathname } = useLocation()
  const currentPost = useSelector(state => state.posts.selectedPost)
  const postId = currentPost._id
  const availableTags = useSelector(state => state.tags.availableTags);
  let selectedTags = useSelector(state => state.tags.selectedTags);
  const error = useSelector(state => state.tags.error);
  const status = useSelector(state => state.tags.status);
  const editPage = pathname.includes("edit")
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
  const [imageElements, setImageElements] = useState([]);
  // const categories = ['Walls', 'Paintings', 'Sketchbooks', 'Video', 'Sculptures']

  // fetch data
  useEffect(() => {
    dispatch(resetTags())
    dispatch(fetchAllTags())
    if(editPage) {
      setPostData(currentPost)
      currentPost.postTags.forEach(tag => {
          dispatch(toggleTag(tag.name))
      })
    } else if(!editPage){
      // dispatch(resetTags())
      // dispatch(fetchAllTags())
      setPostData(
        {
          title: "",
          subtitle: "",
          content: "",
          images: [],
          category: "",
          postTags: []
        }
      )
    }
  }, [])

  // useEffect(() => {
  //   if (status === 'idle') {
  //     dispatch(fetchAllTags())
  //   } else if (status === "succeeded" && editPage) {
  //     setPostData({
  //       title: currentPost.title,
  //       subtitle: currentPost.subtitle,
  //       content: currentPost.content,
  //       images: currentPost.images,
  //       category: currentPost.category,
  //       postTags: currentPost.postTags
  //     });
  //     currentPost.postTags.forEach(tag => {
  //       dispatch(toggleTag(tag))
  //     })
  //   }
  //   // } else if (!editPage) {
  //   //   setPostData({
  //   //     title: "",
  //   //     subtitle: "",
  //   //     content: "",
  //   //     images: [],
  //   //     category: "",
  //   //     postTags: []
  //   //   })
  //   // }
  // }, [dispatch, pathname, status])

  // create image preview
  useEffect(() => {
    const imageKey = editPage ? 'publicId' : 'name';
    setImageElements(postData.images.map((file, i) => {
      const src = editPage ? file.imageUrl : URL.createObjectURL(file);
      return (
        <div key={`image-${i}`} className="preview-images">
          <img src={src} />
          <i id={file[imageKey]} onClick={deleteImage}></i>
        </div>
      )
    }))
  }, [postData.images])

  // delete images from preview
  const deleteImage = (e) => {
    const { id } = e.target;
    let imageKey = editPage ? 'publicId' : 'name';
    const updatedImages = postData.images.filter(file => file[imageKey] !== id)
    setPostData(prev => ({
      ...prev,
      images: updatedImages
    }))
  }

  // set Post Data with input values
  function handleChange(e) {
    const { name, value, files } = e.target;
    setPostData(prev => {
      if (name === "images") {
        return ({ ...prev, images: [...prev.images, ...files] })
      }
      // else if (name === "postTags") {
      //   return ({ ...prev, postTags: [...prev.postTags, value] })
      // }
      else {
        return ({ ...prev, [name]: value })
      }
    });
  }

  // submit form

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
        return selectedTags.map(tag => formData.append("postTags", tag))
      } else {
        return formData.append(key, postData[key]);
      }
    });
    // for (let pair of formData.entries()) {
    //   console.log(pair[0]+ ', ' + pair[1]);
    // }

    dispatch(createPost(formData))
      .then((res) => { if(!res.error) {
        navigate(`/${postData.category}/${res.payload._id}`)
      }})
  }

  // edit existing post
  function handleEdit(e) {
    e.preventDefault()
    if(!postData.category) {
      setEmptyCategory(true);
      return
    }
    const formData = new FormData()
    Object.keys(postData).map((key) => {
      if (key === "images") {
        return postData.images.map(img => formData.append("images", JSON.stringify(img)))
      } else if (key === "postTags") {
        return selectedTags.map(tag => formData.append("postTags", tag))
      } else {
        return formData.append(key, postData[key]);
      }
    });
    // for (let pair of formData.entries()) {
    //   console.log(pair[0]+ ', ' + pair[1]);
    // }

    dispatch(editPost({formData, postId}))
      .then((res) => { if(!res.error) {
        navigate(`/${postData.category}/${res.payload._id}`)
    }})
  }

  // const optionElements = categories.filter(category => category !== postData.category)
  //                                  .map((element, i) => { return <option key={element+i} value={element}>{element}</option> })

  return (
    <div className="form-wrapper">
      <form className="post-form" onSubmit={editPage ? handleEdit : handleSubmit}>

        <div className="post-form-layout">
          <input className="form-post-imgs" type="file" onChange={handleChange} name="images" title="upload images" multiple />
          <div className="image-preview-container">{imageElements}</div>
        </div>

        <div className="post-form-layout">
          <fieldset>
            <input
              className='title'
              type="text" placeholder="ADD A TITLE"
              value={postData.title}
              name="title"
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

            <select name="category" id="categories" onChange={handleChange}>
              {editPage && <option value="">{postData.category}</option>}
              {!editPage && <option value="">Please choose a category</option>}
              <option value="Walls">Walls</option>
              <option value="Paintings">Paintings</option>
              <option value="Sketchbooks">Sketchbooks</option>
              <option value="Video">Video</option>
              <option value="Sculpture">Sculpture</option>
              {/* {optionElements} */}
            </select>
          </fieldset>

          <TagsInputForm />

          <input className="btn-submit" type="submit" value={editPage ? "Save changes " : "Create new post"} />
        </div>

      </form>
      {/* {logoutButton} */}
    </div>
  )
}
