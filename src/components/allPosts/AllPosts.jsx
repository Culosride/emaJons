import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';

export default function AllPosts({ category }) {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    async function loadPosts() {
      const response = await Axios.get(`/api/${category}`)
      setPosts(response.data)
    }
    loadPosts()
  }, [])

  const postElements = posts.map((post) => {
    return <Link to={`/${category}/${post._id}`} id={post._id} key={post._id} >
      <img src={post.images[0].imageUrl}/>
    </Link>
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
          {postElements}
        </div>
      </div>
    </div>
  )
}
