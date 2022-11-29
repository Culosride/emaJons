import React, {useState, useEffect} from "react"
import Axios from "axios"


export default function PostForm () {
  const [postData, setPostData] = useState({
    title: "",
    subtitle:"",
    content:"",
    images: [],
    postTags: []
  })

  function handleChange(e) {
    const { name, value, files } = e.target;
    setPostData(prev => name === "images" ? ({ ...prev, images: [...prev.images, ...files] }) : ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    Object.keys(postData).map((key) => {
      key === "images" ? postData.images.map(img => formData.append("images", img)) : formData.append(key, postData[key]);
    });
    const result = await Axios.post("/posts", formData, { headers: {'Content-Type': 'multipart/form-data'}})
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
