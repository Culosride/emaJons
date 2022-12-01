import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';

export default function Category({ categoryName }) {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    async function loadPosts() {
      const response = await Axios.get("/raw-posts")
      setPosts(response.data)
    }
    loadPosts()
  }, [])

  const gridPostElements = posts.map((post) => {
    return (post.images.length) ?
      <Link to={`${post._id}`} id={post._id} key={post._id} >
        <img src={post.images[0].imageUrl}/>
      </Link> : "";
  })

  const postRoutesElements = posts.map((post) => {
    <Route exact path={`${post._id}`} element={<Post />}></Route>
  })

  return (
    <div>
      <div className="category-container">
        <div className="tags-container">
          <ul>
            <Link to="/"><li>2021</li></Link>
            <Link to="/"><li>2020</li></Link>
          </ul>
        </div>

        <div className="posts-grid">
          {gridPostElements}
        </div>
      </div>
      <Routes>
        {postRoutesElements}
      </Routes>
    </div>
  )
}
