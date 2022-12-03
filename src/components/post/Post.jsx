import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';

export default function Post({ category }) {
  const params = useParams()
  const [post, setPost] = useState([])

  useEffect(() => {
    async function loadPost() {
      const response = await Axios.get(`/api/${category}/${params.postId}`)
      setPost(response.data)
    }
    loadPost()
  }, [])

  console.log(params.postId)
  console.log(post.images)

  return (
    <div className="posts-container">
      <h1 className="title">{post.title}</h1>
      <p className="subtitle">{post.subtitle}</p>
      <p className="content">{post.content}</p>
    </div>
  )
}
