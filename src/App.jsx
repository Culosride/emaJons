import React, { useState, useEffect } from 'react';
import AllPosts from './components/allPosts/AllPosts';
import PostForm from './components/postForm/PostForm';
import Post from './components/post/Post';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import Axios from 'axios'

export default function App() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    async function loadPosts() {
      const response = await Axios.get("/raw-posts")
      setPosts(response.data)
    }
    loadPosts()
  }, [])

  return (
    <Router>
      <div className="App">
        <ul>
          <li><Link to="/walls">Walls</Link></li>
          <li><Link to="/sketchbooks">Sketchbooks</Link></li>
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
        </ul>
        <Routes>
          <Route exact path='/walls' element={<AllPosts category="walls" />} />
          <Route path="/walls/:postId" element={<Post category="walls"/>} />
          <Route exact path='/sketchbooks' element={<AllPosts category="sketchbooks" />} />
          <Route path="/sketchbooks/:postId" element={<Post category="sketchbooks" />} />
          <Route exact path='/admin/dashboard' element={<PostForm />}></Route>
        </Routes>
      </div>
    </Router>
  )
}
