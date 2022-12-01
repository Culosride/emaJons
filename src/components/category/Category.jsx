import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import GridPost from '../post/GridPost';

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
    return (
      <GridPost
        image={post.images[0]}
        id={post._id}
        key={post._id}
      />
    )
  })

  return (
    <div>
      <div className="category-container">
        <div className="tags-container">
          <ul>
            <li>2021</li>
            <li>2020</li>
          </ul>
        </div>
        <div className="posts-grid">
          {gridPostElements}
        </div>
      </div>
    </div>
  )
}
