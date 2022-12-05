import React, { useState } from "react";
import Axios from "axios";
import { useNavigate } from 'react-router-dom';


export default function PostForm () {
  const navigate = useNavigate();
  const [postData, setPostData] = useState({
    title: "",
    subtitle:"",
    content:"",
    images: [],
    category: "",
    postTags: []
  })

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    Object.keys(postData).map((key) => {
      if (key === "images") {
        return postData.images.map(img => formData.append("images", img))
      } else if (key === "postTags") {
        return postData.postTags.map(tag => formData.append("postTags", tag))
      } else {
        return formData.append(key, postData[key]);
      }
    });
    await Axios.post("/posts", formData, { headers: {'Content-Type': 'multipart/form-data'}})
    navigate(`/${postData.category}`)
  }

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

        <label htmlFor="postTags" multiple>Tags:</label>
        <select name="postTags" id="postTags" onChange={handleChange}>
          <option value="">-- Please choose a tag --</option>
          <option value="Palermo">Palermo</option>
          <option value="Mexico">Mexico</option>
        </select>

        <input type="file" onChange={handleChange} name="images" multiple />

        <input type="submit" value="Submit images!" />

        {/* <select
          id="postTags"
          value={postData.postTags}
          onChange={handleChange}
          name="postTags"
        >
          <option value="">clicca qui pirla</option>
          <option value="palermo">palermo</option>
          <option value="2019">2019</option>
          iterate each tag option
        </select> */}
      </form>
    </div>
  )
}
