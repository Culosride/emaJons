
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // hook to select data from redux store
import Post from "../post/Post"
import { selectAllPosts, fetchPosts, fetchPostsByCategory } from "../../features/posts/postsSlice";
const _ = require('lodash');

import Axios from 'axios';
import { Link, useParams } from 'react-router-dom';

export default function AllPosts() {
  const params = useParams();
  const dispatch = useDispatch()
  const posts = useSelector(state => state.posts.posts)
  const categoryTags = useSelector(state => tags)
  const status = useSelector(state => state.posts.status)
  const error = useSelector(state => state.posts.error)

  let postElements = []

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPostsByCategory(params.category))
    }
  }, [status, dispatch])

  const displayPosts = (posts) => {
    return posts.map((post) => {
      return <Link reloadDocument to={`/${params.category}/${post._id}`} id={post._id} key={post._id} >
        {post.images.length && <img src={post.images[0].imageUrl}/>}
      </Link>
    })
  }

  if (status === 'loading') {
    postElements = <p>Loading...</p>
  } else if (status === 'succeeded') {
    postElements = displayPosts(posts)
  } else if (status === 'failed') {
    postElements = <div>{error}</div>
  }

  return (
    <div>
      <div className="category-container">
        <div className="tags-container">
          <ul>
            {postElements}
          </ul>
        </div>
        {/* {status === 'succeeded' && displayPosts(posts)} */}
        {/* {(posts.length !== 0) &&
          <div className="posts-grid">
            {
              filteredPosts.message && filteredPosts.message ||
              filteredPosts.length && displayPosts(filteredPosts) ||
              displayPosts(posts)
            }
          </div> ||
          <p>No posts yet</p>
        } */}
      </div>
    </div>
  )
}
