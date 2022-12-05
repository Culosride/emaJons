import React, { useState, useEffect } from 'react';
// import Axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // hook to select data from redux store
import { fetchPostById } from '../../features/posts/postsSlice';


export default function Post() {
  const dispatch = useDispatch()
  const params = useParams()
  const post = useSelector(state => state.posts.posts)
  const status = useSelector(state => state.posts.status)
  const error = useSelector(state => state.posts.error)
  console.log("post",post)

  let imageElements = []
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPostById(params))
    }
  }, [status, dispatch])

  if (status === 'loading') {
    imageElements = <p>Loading...</p>
  } else if (status === 'succeeded') {
      imageElements = post.images.map((image) => {
        return <img src={image.imageUrl} key={image.publicId}/>
      })
  } else if (status === 'failed') {
    imageElements = <div>{error}</div>
  }


  console.log(imageElements)
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
