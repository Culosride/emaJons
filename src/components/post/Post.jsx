import React, { useState, useEffect } from 'react';
// import Axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // hook to select data from redux store
import { fetchPostById } from '../../features/posts/postsSlice';
import { createSelector } from '@reduxjs/toolkit';

// const selectPost = createSelector(
//   (state) => state.posts.posts,
//   (state) => state.posts.lastId,
//   (posts, lastId) => posts.filter(post => post._id === lastId)
// )

// export const selectedPost = () => {
//   const post = useSelector(selectPost)
//   return post
// }

export default function Post() {
  const dispatch = useDispatch()
  // const post = selectedPost()
  // const id = useSelector(state => state.posts.lastId)
  const post = useSelector(state => state.posts.selectedPost)
  const params = useParams()
  const status = useSelector(state => state.posts.status)
  const error = useSelector(state => state.posts.error)
  console.log("post", post)

  let imageElements = []
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPostById(params))
    }
  }, [status, dispatch])

  if (status === 'loading') {
    imageElements = <p>Loading...</p>
  } else if (status === 'succeeded') {
      post && displayImgs(post)
  } else if (status === 'failed') {
    imageElements = <div>{error}</div>
  }

  function displayImgs(post) {
    imageElements = post.images.map((image) => {
      return <img src={image.imageUrl} key={image.publicId}/>
    })
  }

  return (
      <div className="post-container">
        <div>
          <div className="images-container">
            {post && imageElements}
          </div>
          <div className="text-container">
            <h1 className="title">{post && post.title}</h1>
            <p className="subtitle">{post && post.subtitle}</p>
            <p className="content">{post && post.content}</p>
          </div>
        </div>
      </div>
  )
}
