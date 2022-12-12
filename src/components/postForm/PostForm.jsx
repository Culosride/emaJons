import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { addPost } from "../../features/posts/postsSlice"
import { fetchCategoryTags, addCategoryTag } from "../../features/categories/categorySlice"
import { useSelector, useDispatch } from "react-redux";


export default function PostForm () {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tagsByCategory = useSelector(state => state.categories.categoryTags);
  const error = useSelector(state => state.categories.error);
  const status = useSelector(state => state.categories.status);
  const [tags, setTags] = useState(tagsByCategory)
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
  // console.log(postData)

  useEffect(() => {
    if(postData.category){
      dispatch(fetchCategoryTags(postData.category))
      // setTags(tagsByCategory)
    }
  }, [postData.category])

  function createNewTag() {
    dispatch(addCategoryTag([tag, postData.category])) &&
    setTag("")
  }

  function handleChange(e) {
    const { name, value, files } = e.target;
    setPostData(prev => {
      if (name === "images") {
        return ({ ...prev, images: [...prev.images, ...files] })
      } else if (name === "postTags") {
        // setTags((prev => prev.filter(singleTag => singleTag !== value)));
        return ({ ...prev, postTags: [...prev.postTags, value]  })
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
    // const res = await Axios.post("/posts", formData, { headers: {'Content-Type': 'multipart/form-data'}})
    // navigate(`/posts/${postData.category}/${res.data.lastId}`)

    dispatch(addPost(formData))
      .then((res) => navigate(`posts/${postData.category}/${res.payload._id}`))
  }

  const tagOptions = tagsByCategory.map((tag, i) => {
    return <option name="postTags" value={tag} key={`${tag}-${i}`}>{tag}</option>
  })

  return (
    <div className="form-wrapper">
      <form className="post-form" onSubmit={handleSubmit}>
        <label className="">Title</label>
        <input className="form-post-title" type="text" placeholder="UNTITLED" value={postData.title} name="title" onChange={handleChange} />

        <label className="form-post-subtitle">Subtitle</label>
        <input type="text" className="form-post-subtitle" placeholder="Subtitle" value={postData.subtitle} name="subtitle" onChange={handleChange}/>

        <label>Content</label>
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

        {postData.category && <div className="tags-container">
          <div>
            <label htmlFor="postTags" multiple>Add tags:</label>
            <select name="postTags" id="postTags" onChange={handleChange} disabled={!tagsByCategory.length}>
              <option value="">-- Please choose a tag --</option>
              {tagOptions}
            </select>
          </div>
          <label>Or create a new one</label>
          <input type="text" value={tag} placeholder="New tag" name="tag" onChange={handleTag} className="" />
          <button type="button" onClick={createNewTag}>Create new tag</button>
          {error && <p>{error}</p>}
        </div>}

        <input className="form-post-imgs" type="file" onChange={handleChange} name="images" multiple />

        <input type="submit" value="Submit post!" />
      </form>
    </div>
  )
}
