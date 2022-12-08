import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from 'react-router-dom';
import { addPost } from "../../features/posts/postsSlice"
import { addTag } from "../../features/tags/tagsSlice"
import { useSelector, useDispatch } from "react-redux";


export default function PostForm () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const id = useSelector(state => state.posts.lastId);
  const [tag, setTag] = useState("");
  const [error, setError] = useState(false);
  const [postData, setPostData] = useState({
    title: "",
    subtitle:"",
    content:"",
    images: [],
    category: "",
    postTags: []
  });
  const allTags = useSelector(state => state.tags.allTags);

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
    console.log(postData)
  }

  function addNewTag(e) {
    e.preventDefault()
    const { name, value } = e.target;
    setPostData(prev => {
      return ({ ...prev, [name]: value })
    })
  }
  function handleTag(e) {
    const { name, value } = e.target;
    if(name === "tag") {setTag(() => {
      return value
    })}
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!postData.category) {
      setError(true);
      return
    }

    const formData = new FormData()
    Object.keys(postData).map((key) => {
      if (key === "images") {
        return postData.images.map(img => formData.append("images", img))
      } else if (key === "postTags") {
        return postData.postTags.map(postTag => formData.append("postTags", postTag))
      } else {
        return formData.append(key, postData[key]);
      }
    });

    dispatch(addPost(formData))
      .then((res) => navigate(`/${postData.category}/${res.payload._id}`))
  }

  const tagOptions = allTags.map((tag, i) => {
    return <option value={tag} key={`${tag}-${i}`}>{tag}</option>
  })

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input type="text" placeholder= "Untitled" value={postData.title} name="title" onChange={handleChange} className="" />

        <label>Subtitle</label>
        <input type="text" value={postData.subtitle} name="subtitle" onChange={handleChange} className="" />

        <label>Content</label>
        <textarea value={postData.content} name="content" onChange={handleChange} className="" />

        <label htmlFor="categories">Category:</label>
        <select name="category" id="categories" onChange={handleChange}>
          <option value="">-- Please choose a category --</option>
          <option value="Walls">Walls</option>
          <option value="Paintings">Paintings</option>
          <option value="Sketchbooks">Skethbooks</option>
          <option value="Video">Video</option>
          <option value="Sculpture">Sculpture</option>
        </select>
        {error && <p>Devi pigliarne una</p>}

        <div className="tags-container">
          <div>
            <label htmlFor="postTags" multiple>Tags:</label>
            <select name="postTags" id="postTags" onChange={handleChange} disabled={!allTags.length}>
              <option value="">-- Please choose a tag --</option>
              {tagOptions}
            </select>
            <button name="addPostTag" onClick={addNewTag}>Add tag</button>
          </div>
          <label>Or create a new one</label>
          <input type="text" value={tag} placeholder="New tag" name="tag" onChange={handleTag} className="" />
          <button type="button" onClick={() => dispatch(addTag(tag)) && setTag("")}>Create new tag</button>
        </div>

        <input type="file" onChange={handleChange} name="images" multiple />

        <input type="submit" value="Submit post!" />
      </form>
    </div>
  )
}
