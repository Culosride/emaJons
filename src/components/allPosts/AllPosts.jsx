import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Link, useParams } from 'react-router-dom';

export default function AllPosts() {
  const params = useParams();
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    async function loadData() {
      const posts = await Axios.get(`/api/posts/${params.category}`)
      setPosts(posts.data)
      const tags = await Axios.get(`/api/categories/${params.category}`)
      setTags(tags.data[0].allTags)
    }
    loadData()
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    const filter = e.target.getAttribute('data-value');
    const filteredPosts = posts.filter((post) => {
      return post.postTags.includes(filter);
    })
    setFilteredPosts(filteredPosts);
  }

  const displayPosts = (selectedPosts) => {
    return selectedPosts.map((post) => {
      return <Link reloadDocument to={`/${params.category}/${post._id}`} id={post._id} key={post._id} >
        <img src={post.images[0].imageUrl}/>
      </Link>
    })
  }

  // display category tags
  const tagElements = tags.map((tag, i) => {
    return <li key={`${tag}-${i}`}>
      <a href={tag} data-value={`${tag}`} onClick={handleClick}>{tag}</a>
    </li>
  })

  return (
    <div>
      <div className="category-container">
        <div className="tags-container">
          <ul>
            {tagElements}
          </ul>
        </div>

        <div className="posts-grid">
          {filteredPosts.length && displayPosts(filteredPosts) || displayPosts(posts)}
        </div>
      </div>
    </div>
  )
}
