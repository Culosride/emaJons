
import React, {useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // hook to select data from redux store
import { fetchPostsByCategory, setCurrentCategory } from "../../features/posts/postsSlice";
import { fetchAllTags } from "../../features/categories/categoriesSlice";
import { Link, useParams } from 'react-router-dom';
import NotFound from '../404/NotFound';
import {  } from 'react';
const _ = require('lodash');

export default function AllPosts() {
  const params = useParams();
  const dispatch = useDispatch()
  const posts = useSelector(state => state.posts.posts)
  const postsByCategory = posts.filter(post => (post.category === _.capitalize(params.category)))
  let status = useSelector(state => state.posts.status)
  const error = useSelector(state => state.posts.error)
  const allTags = postsByCategory.flatMap(post => post.postTags.map(tag => tag))
  const sortedTags = [...new Set(allTags.sort((a, b) => b.localeCompare(a)))];
  const [filteredPosts, setFilteredPosts] = useState([])
  let postElements = [];

  const [hoveredPost, setHoveredPost] = useState(null)
  const handleMouseEnter = (postId) => {
    setHoveredPost(postId);
  }
  const handleMouseLeave = () => {
    setHoveredPost(null)
  }

  const displayPosts = (posts) => {
    return posts.map((post, i) => {
        return (
          <Link reloadDocument to={`/${params.category}/${post._id}`} id={post._id} key={post._id} >
            {post.media.length ?
            <>
              <img className='allposts-img'
              onMouseEnter={() => handleMouseEnter(post._id)}
              onMouseLeave={handleMouseLeave}
              key={i}
              src={post.media[0].url}/>
              { hoveredPost === post._id &&
              <div className="post-info">
                <p>{post.title.split(",").join("").toUpperCase()}</p>
              </div>}
            </> :
            <p key={i}>{post.title}</p>}
          </Link>
        )
    })
  }

  useEffect(() => {
    dispatch(setCurrentCategory(params.category))
    dispatch(fetchAllTags())
  }, [params])

  if(status === "failed") {
    postElements = <p>{error}</p>
  } else if (status === "loading") {
    postElements = <p>Loading..</p>
  } else if (status === "succeeded") {
    postElements =
    filteredPosts.message && filteredPosts.message ||
    filteredPosts.length && displayPosts(filteredPosts) ||
    displayPosts(postsByCategory)
  }

  // filter posts on tag click
  const handleClick = (e) => {
    e.preventDefault();
    const filter = e.target.getAttribute('data-value');
    const filtered = postsByCategory.filter((post) => {
      return post.postTags.some(tag => tag === filter)
    })
    filtered.length && setFilteredPosts(filtered);
  }

  // create tag elements
  const tagElements = sortedTags.map((tag, i) => (
    <a key={i} href="#">
      <li onClick={handleClick} data-value={tag}>{tag}</li>
    </a>
  ))

  return (
    <div>
      <div className="category-container">
        <div className="select-tags-container">
          <ul>
            {tagElements}
          </ul>
        </div>
          <div className="posts-grid">
            {postElements}
          </div>
      </div>
    </div>
  )
}
