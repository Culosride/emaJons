
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // hook to select data from redux store
import { fetchPostsByCategory } from "../../features/posts/postsSlice";
import { Link, useParams } from 'react-router-dom';
const _ = require('lodash');

export default function AllPosts() {
  const params = useParams();
  const dispatch = useDispatch()
  const posts = useSelector(state => state.posts.posts)
  let status = useSelector(state => state.posts.status)
  const error = useSelector(state => state.posts.error)
  const allTags = useSelector(state => state.posts.posts.flatMap(post => post.postTags.map(tag => tag)))
  const cleanedTags = [...new Set(allTags.sort((a, b) => b.localeCompare(a)))];

  const [filteredPosts, setFilteredPosts] = useState([])

  let postElements = []

  useEffect(() => {
    status = 'idle'
    setFilteredPosts([])
  }, [params])

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPostsByCategory(params.category))
    }
  }, [status, dispatch, params])

  // filter posts on tag click
  const handleClick = (e) => {
    e.preventDefault();
    const filter = e.target.getAttribute('data-value');
    const filteredPosts = posts.filter((post) => {
      return post.postTags.includes(filter);
    })
    filteredPosts.length && setFilteredPosts(filteredPosts);
  }

  // create tag elements
  const tagElements = cleanedTags.map((tag, i) => (
    <a key={i} href="#"><li onClick={handleClick} data-value={tag}>{tag}</li></a>
  ))

  // helper function to show posts
  const displayPosts = (posts) => {
    return posts.map((post, i) => (
      <Link reloadDocument to={`/${params.category}/${post._id}`} id={post._id} key={post._id} >
        {post.images.length ? <img key={i} src={post.images[0].imageUrl}/> : <p key={i}>{post.title}</p>}
      </Link>
    ))
  }

  if (status === 'loading') {
    postElements = <p>Loading...</p>
  } else if (status === 'succeeded') {
    postElements = filteredPosts.message && filteredPosts.message ||
                   filteredPosts.length && displayPosts(filteredPosts) ||
                   displayPosts(posts)
  } else if (status === 'failed') {
    postElements = <div>{error}</div>
  }

  return (
    <div>
      <div className="category-container">
        <div className="tags-container">
          <ul>
            {tagElements}
          </ul>
        </div>
          <div className="posts-grid">
            {postElements.length && postElements}
          </div>
      </div>
    </div>
  )
}
