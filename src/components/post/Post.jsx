import React, { useState, useEffect } from 'react';
// import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Carousel from '../carousel/Carousel';
import { useSelector, useDispatch } from 'react-redux'; // hook to select data from state (in redux store)
import { fetchPostsByCategory, deletePost, fetchPostById } from '../../features/posts/postsSlice';

export default function Post() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const post = useSelector(state => state.posts.selectedPost)
  const params = useParams()
  const status = useSelector(state => state.posts.status)
  const error = useSelector(state => state.posts.error)
  const category = params.category
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
  function handleDelete() {
    dispatch(deletePost([post._id, category]))
      .then(() => navigate(`/${params.category}`))
      .then(() => dispatch(fetchPostsByCategory(params.category)))
  }

  return (
      <div className="post-container">
        {post.images &&
          <Carousel className="images-container" images={post.images}>
          </Carousel>
        }
        <div className={post.content ? 'text-container text-container-content' : 'text-container'}>
          <div>
            <div className="headline">
              <div>
                <h1 className="title">{post.title}</h1>
                <button onClick={handleDelete}>DELETE POST</button>
                {post.subtitle && <p className="subtitle">{post.subtitle}</p>}
              </div>
            </div>
            {post.content && <p className="content">{post.content}</p>}
          </div>
        </div>
      </div>
  )
}
