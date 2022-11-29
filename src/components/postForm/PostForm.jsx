import React, {useState, useEffect} from "react"
import Axios from "axios"


export default function PostForm () {
  const [formData, setFormData] = useState({
    title: "",
    subtitle:"",
    content:"",
    images: [],
    postTags: []
  })

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    console.log({value})
  }

  function handleSubmit() {

  }

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input type="text" value={formData.title} name="title" onChange={handleChange} className="" />

        <label>Subtitle</label>
        <input type="text" value={formData.subtitle} name="subtitle" onChange={handleChange} className="" />

        <label>Content</label>
        <textarea value={formData.content} name="content" onChange={handleChange} className="" />

        {/* <select
          id="postTags"
          value={formData.postTags}
          onChange={handleChange}
          name="postTags"
        >
          <option value="">clicca qui pirla</option>
          <option value="red">Red</option>
          <option value="orange">Orange</option>
          <option value="yellow">Yellow</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
          <option value="indigo">Indigo</option>
          <option value="violet">Violet</option>
        </select> */}
      </form>
    </div>
  )
}
