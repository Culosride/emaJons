import React, { useState, useEffect, useRef } from 'react';
// import Axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Carousel from '../carousel/Carousel';
import { useSelector, useDispatch } from 'react-redux'; // hook to select data from state (in redux store)
import { fetchPostsByCategory, toggleFullscreen, fetchPostById, setCurrentPost } from '../../features/posts/postsSlice';
import { selectCurrentToken } from '../../features/auth/authSlice';

export default function Post() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const params = useParams()
  const token = useSelector(selectCurrentToken)
  const currentId = params.postId
  const post = useSelector(state => state.posts.posts.find(post => post._id === currentId))
  const status = useSelector(state => state.posts.status)
  const error = useSelector(state => state.posts.error)
  const category = params.category

  const [initialPosition, setInitialPosition] = useState(0)
  const isFullscreen = useSelector(state => state.posts.fullscreen)
  let imageElements = []

  useEffect(() => {
    if (status === 'idle') {
    dispatch(setCurrentPost(post))
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

  // interaction
  const handleFullscreen = () => {
    dispatch(toggleFullscreen())
    // setFullScreen(!fullScreen)
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

  return (
    <div className={`post-container ${content ? "layout-50" : ""} ${isFullscreen ? "layout-100" : ""}`}>
        {post.images &&
          <Carousel
            content={content}
            images={post.images}
            toggleFullScreen={handleFullscreen}
          ></Carousel>
        }
        <div className="text-container" onScroll={handleScroll} onClick={handleFullscreen}>
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
