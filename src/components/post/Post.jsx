import React from "react";
import {
  BrowserRouter as Router,
  Outlet,
  Link
} from 'react-router-dom';
import Axios from 'axios';

export default function Post () {
  const [post, setPost] = useState([])

  useEffect(() => {
    async function loadPost() {
      const response = await Axios.get("/walls/:postId")
      setPost(response.data)
    }
    loadPost()
  }, [])

  const imagesEl = post.images.map(image => {
    return <img
      src={image.imageUrl}
      key={image.publicId}
      alt={image.publicId}
    />
  })

  return (
    <div className="posts-container">
      <div>
        <div className="images-container">{imagesEl}</div>
        <div className="text-container">
          <h1 className="title">{post.title}</h1>
          <p className="subtitle">{post.subtitle}</p>
          <p className="content">{post.content}</p>
        </div>
      </div>
    </div>
  )
}
