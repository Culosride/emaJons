import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from 'react-router-dom';


export default function PostForm () {
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [postData, setPostData] = useState({
    title: "",
    subtitle:"",
    content:"",
    images: [],
    category: "",
    postTags: []
  })

  useEffect(() => {
    async function loadTags() {
      const tags = await Axios.get(`/api/categories/${postData.category}`)
      if (tags.data[0]) {
        setTags(tags.data[0].allTags)
      } else {
        setTags([])
      }
    }
    loadTags()
  }, [postData]);

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
    const res = await Axios.post("/posts", formData, { headers: {'Content-Type': 'multipart/form-data'}})
    navigate(`/posts/${postData.category}/${res.data.lastId}`)
  }

  const tagOptions = tags && tags.map((tag, i) => {
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

        <label htmlFor="postTags" multiple>Tags:</label>
        <select name="postTags" id="postTags" onChange={handleChange} disabled={postData.category === ''}>
          <option value="">-- Please choose a tag --</option>
          {tagOptions}
        </select>

        <input type="file" onChange={handleChange} name="images" multiple />

        <input type="submit" value="Submit images!" />
      </form>
    </div>
  )
}
