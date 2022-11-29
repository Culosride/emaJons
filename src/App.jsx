import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Post from './components/post/Post'

export default function App() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    async function loadPosts() {
      const response = await Axios.get("/posts")
      setPosts(response.data)
    }
    loadPosts()
  }, [])

  const postElements = posts.map((post) => {
    return <Post
      images={post.images}
      title={post.title}
      subtitle={post.subtitle}
      content={post.content}
      id={post._id}
      key={post._id}
    />
  })

  return (
    <div>
      {postElements}
    </div>
  )
}
