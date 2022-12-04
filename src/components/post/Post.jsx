import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';

export default function Post() {
  const params = useParams()
  const [post, setPost] = useState([])
  let imageElements;

  useEffect(() => {
    async function loadPost() {
      const response = await Axios.get(`/api/posts/${params.category}/${params.postId}`)
      setPost(response.data)
    }
    loadPost()
  }, [])

  if (post.images !== undefined) {
    imageElements = post.images.map((image) => {
      return <img src={image.imageUrl} key={image._id}/>
    })
  }

  return (
      <div className="post-container">
        <div>
          <div className="images-container">
            {imageElements}
          </div>
          <div className="text-container">
            <h1 className="title">{post.title}</h1>
            <p className="subtitle">{post.subtitle}</p>
            <p className="content">{post.content}</p>
          </div>
        </div>
      </div>
  )
}
