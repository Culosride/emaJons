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
      if (tags.data.length) setTags(tags.data[0].allTags)
    }
    loadData()
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    const filter = e.target.getAttribute('data-value');
    const filteredPosts = posts.filter((post) => {
      return post.postTags.includes(filter);
    })
    filteredPosts.length ? setFilteredPosts(filteredPosts) : setFilteredPosts({message: 'Sorry, no posts'});
  }

  const displayPosts = (selectedPosts) => {
    return selectedPosts && selectedPosts.map((post) => {
      return <Link reloadDocument to={`/posts/${params.category}/${post._id}`} id={post._id} key={post._id} >
        {(post.images.length) ? <img src={post.images[0].imageUrl} /> : <p>{post.title}</p>}
      </Link>
    })
  }

  const tagElements = tags && tags.map((tag, i) => {
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

        {(posts.length !== 0) &&
          <div className="posts-grid">
            {
              filteredPosts.message && filteredPosts.message ||
              filteredPosts.length && displayPosts(filteredPosts) ||
              displayPosts(posts)
            }
          </div> ||
          <p>No posts yet</p>
        }
      </div>
    </div>
  )
}
