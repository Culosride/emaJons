import React, { useState, useEffect } from "react"
import { createRoot } from "react-dom/client"
import Header from "./components/header/Header.jsx"
import LogoutBtn from "./components/logout-btn/LogoutBtn.jsx"
import Post from "./components/post/Post.jsx"
import PostForm from "./components/postForm/PostForm.jsx"
import Navbar from "./components/navbar/Navbar"
import Axios from "axios"
import * as api from "./API/index"

export default function App() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    async function loadPosts() {
      const response = await api.getPosts()
      setPosts(response.data)
    }
    loadPosts()
  }, [])

  const postElements = posts.map(post => <Post title={post.title} images={post.images} id={post._id} key={post._id} />)

  return (
    <div>
      <Navbar />
      <PostForm />
      {postElements}
    </div>
  )
}
