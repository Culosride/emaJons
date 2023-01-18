import React, { useState, useEffect, useRef } from 'react';
// import Axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Carousel from '../carousel/Carousel';
import { useSelector, useDispatch } from 'react-redux'; // hook to select data from state (in redux store)
import { fetchPostsByCategory, toggleFullscreen, deletePost, fetchPostById } from '../../features/posts/postsSlice';
import { selectCurrentToken } from '../../features/auth/authSlice';

export default function Post() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const token = useSelector(selectCurrentToken)
  const post = useSelector(state => state.posts.selectedPost)
  const params = useParams()
  const status = useSelector(state => state.posts.status)
  const error = useSelector(state => state.posts.error)
  const category = params.category
  // const textContainer = useRef(null)
  const [initialPosition, setInitialPosition] = useState(0)

  // useEffect(() => {
  //   setInitialPosition(textContainer.current.clientHeight * .6);
  // }, [])

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
    dispatch(deletePost([post._id, category, token]))
      .then(() => navigate(`/${params.category}`))
      .then(() => dispatch(fetchPostsByCategory(params.category)))
  }

  // interaction
  const [fullScreen, setFullScreen] = useState(false)
  const toggleFullScreen = () => {
    dispatch(toggleFullscreen())
    setFullScreen(!fullScreen)
  }

  // const headerRef = useRef(null)

  const handleScroll = (e) => {
    const headline = e.target.lastElementChild.firstElementChild;

    const headerRef = document.querySelector(".header-post")
    // console.log(headline.getBoundingClientRect())
    if (headline.getBoundingClientRect().top < 60) {
      headline.classList.add('headline-sticky')
      headerRef.classList.add('fade-top')
    } else if (headline.getBoundingClientRect().top > 70) {
      headerRef.classList.remove('fade-top')
      headline.classList.remove('headline-sticky')
    }
  }

  const content = post.content && post.content.length > 100

  // <div ref={headerRef} className="header-post">
//    <Link reloadDocument to="/" className="logo">EmaJons</Link>
//    {/* <button className="delete-post" onClick={handleDelete}>DELETE POST</button> */}
//    {!fullScreen && <button onClick={() => navigate(-1)}><i className="close-icon"></i></button>}
//   </div>

  return (
    <div className={`post-container ${content ? "layout-50" : ""} ${fullScreen ? "layout-100" : ""}`}>
        {post.images &&
          <Carousel
            content={content}
            images={post.images}
            toggleFullScreen={toggleFullScreen}
          ></Carousel>
        }
        <div className="text-container" onScroll={handleScroll} onClick={toggleFullScreen}>
          <div className="description-container">
            <div className="headline">
              <div>
                <h1 className="title">{post.title}</h1>
                {post.subtitle && <p className="subtitle">{post.subtitle}</p>}
              </div>
            </div>
            {post.content && <p className="content">{post.content}</p>}
          </div>
        </div>
      </div>
  )
}
