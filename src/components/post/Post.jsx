import React, { useState, useEffect } from 'react';
// import Axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Carousel from '../carousel/Carousel';
import { useSelector, useDispatch } from 'react-redux'; // hook to select data from state (in redux store)
import { fetchPostsByCategory, deletePost, fetchPostById } from '../../features/posts/postsSlice';

export default function Post() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const post = useSelector(state => state.posts.selectedPost)
  const params = useParams()
  const status = useSelector(state => state.posts.status)
  const error = useSelector(state => state.posts.error)

  // load data
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

  // interaction
  const [fullScreen, setFullScreen] = useState(false)
  const toggleFullScreen = () => setFullScreen((prev) => !prev)

  const handleScroll = (e) => {
    const headline = e.target.lastElementChild.firstElementChild;
    (headline.getBoundingClientRect().top === 0) ? headline.classList.add('headline-sticky') : headline.classList.remove('headline-sticky')
  }

  const content = post.content && post.content.length > 100

  return (
      <div className={`post-container ${content ? "layout-50" : ""} ${fullScreen ? "layout-100" : ""}`}>
        {post.images &&
          <Carousel
            content={content}
            images={post.images}
            toggleFullScreen={toggleFullScreen}
          ></Carousel>
        }
        <div
          className="text-container"
          onScroll={handleScroll}
          onClick={toggleFullScreen}
        >
          <div className="header-post">
            <Link reloadDocument to="/" className="logo">EmaJons</Link>
          </div>
          {!fullScreen && <button onClick={() => navigate(-1)}><i className="close-icon"></i></button>}
          <div className="description-container">
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
