import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { addPost } from "../../features/posts/postsSlice"
import { deleteTag, fetchAllTags, addNewTag } from "../../features/categories/categorySlice"
import { useSelector, useDispatch } from "react-redux";
import Tag from "../tag/Tag";

export default function PostForm () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const availableTags = useSelector(state => state.categories.allTags);
  const error = useSelector(state => state.categories.error);
  const status = useSelector(state => state.categories.status);
  const [selectedTags, setSelectedTags] = useState([])
  const [tag, setTag] = useState("");
  const [emptyCategory, setEmptyCategory] = useState(false);
  const [postData, setPostData] = useState({
    title: "",
    subtitle:"",
    content:"",
    images: [],
    category: "",
    postTags: []
  });

  useEffect(() => {
  if (status === 'idle') {
    dispatch(fetchAllTags())
      // setTags(tagsByCategory)
    }
  }, [dispatch, status])

  function createNewTag() {
    dispatch(addNewTag(tag)) &&
    setTag("")
  }

  function handleTagDelete(tagName) {
    // console.log(tagName)
    dispatch(deleteTag(tagName))
  }

  function toggleTag(tagName, selected) {
    if(selected){
      setPostData(prev => ({ ...prev, postTags: [...prev.postTags, tagName] }))
    } else {
      const filteredTags = availableTags.filter(tag => tag!== tagName)
      setPostData(prev => ({ ...prev, postTags: [...filteredTags]}))
    }
  }
  console.log(postData,availableTags)

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

  const handleSubmit = async (e) => {
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
        return postData.postTags.map(postTag => formData.append("postTags", postTag))
      } else {
        return formData.append(key, postData[key]);
      }
    });

    dispatch(addPost(formData))
      .then((res) => navigate(`/${postData.category}/${res.payload._id}`))
  }

  const tagElements = availableTags.map((t, i) => {
    if(t.startsWith(tag)) {
      return <Tag toggleTag={toggleTag} selected="false" handleTagDelete={handleTagDelete} name={t} id={`${t}-${i}`} key={`${t}-${i}`}/>
    }
  })

  const selectedTagElements = postData.postTags.map((t, i) => {
    return <Tag toggleTag={toggleTag} handleTagDelete={handleTagDelete} name={t} id={`${t}-${i}`} key={`${t}-${i}`}/>
  })

  return (
    <div className="form-wrapper">
      <form className="post-form" onSubmit={handleSubmit}>
        {/* <label className="">TITLE</label> */}
        <input className="form-post-title" type="text" placeholder= "UNTITLED" value={postData.title} name="title" onChange={handleChange} />

        {/* <label className="form-post-subtitle">Subtitle</label> */}
        <input type="text" className="form-post-subtitle" placeholder= "Subtitle" value={postData.subtitle} name="Subtitle" onChange={handleChange}/>

        {/* <label>Content</label> */}
        <textarea className="form-post-content" placeholder= "Add content here....." value={postData.content} name="content" onChange={handleChange}/>

        <label htmlFor="categories">Category:</label>
        <select name="category" id="categories" onChange={handleChange}>
          <option value="">-- Please choose a category --</option>
          <option value="Walls">Walls</option>
          <option value="Paintings">Paintings</option>
          <option value="Sketchbooks">Skethbooks</option>
          <option value="Video">Video</option>
          <option value="Sculpture">Sculpture</option>
        </select>
        {emptyCategory && <p>Devi pigliarne una</p>}
        {selectedTagElements}
        <div className="tags-container">
          <div>
            <label htmlFor="postTags" multiple>Add tags:</label>
            {tagElements}
          </div>
          <input type="text" value={tag} placeholder="New tag" name="tag" onChange={handleTag} className="" />
          <button type="button" onClick={createNewTag}>Create new tag</button>
          {/* {error && <p>{error}</p>} */}
        </div>

        <input className="form-post-imgs" type="file" onChange={handleChange} name="images" multiple />

        <input type="submit" value="Submit post!" />
      </form>
    </div>
  )
}
