
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // hook to select data from redux store
import { selectAllPosts, fetchPosts, fetchPostsByCategory } from "../../features/posts/postsSlice";
const _ = require('lodash');

import Axios from 'axios';
import { Link, useParams } from 'react-router-dom';

export default function AllPosts() {
  const params = useParams();
  const dispatch = useDispatch()
  const posts = useSelector(state => state.posts.posts)
  const status = useSelector(state => state.posts.status)
  const error = useSelector(state => state.posts.error)

  let postElements = []

  const [categoryTags, setCategoryTags] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPostsByCategory(params.category))
    }
  }, [status, dispatch])

  // collects all tags from posts
  useEffect(() => {
    posts.forEach(post => {
      post.postTags.forEach(tag => {
        setCategoryTags((prev) => [...prev, tag])
      })
    })
  }, [posts])

  // filter posts on tag click
  const handleClick = (e) => {
    e.preventDefault();
    const filter = e.target.getAttribute('data-value');
    const filteredPosts = posts.filter((post) => {
      return post.postTags.includes(filter);
    })
    filteredPosts.length ? setFilteredPosts(filteredPosts) : setFilteredPosts({message: 'Sorry, no posts'});
  }

  // remove duplicate tags
  const cleanedTags = [...new Set(categoryTags.sort((a, b) => b.localeCompare(a)))];

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
            {postElements.length && postElements || <p>No posts yet</p>}
          </div>
        {/* {status === 'succeeded' && displayPosts(posts)} */}
      </div>
    </div>
  )
}
