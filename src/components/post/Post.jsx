import React, { useState, useEffect, useRef } from 'react';
// import Axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Carousel from '../carousel/Carousel';
import { useSelector, useDispatch } from 'react-redux'; // hook select data from state (in redux store)
import { toggleFullscreen, setCurrentPost } from '../../features/posts/postsSlice';
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

  const fullscreen = useSelector(state => state.posts.fullscreen)
  let mediaElements = []

  useEffect(() => {
    dispatch(setCurrentPost(post))
  }, [])
  console.log(post.media)
  useEffect(() => {
    const escapeFullscreen = (e) => {
      console.log(fullscreen)
      if(e.key === "Escape" && fullscreen) {
        navigate(`/${category}/${currentId}`)
        dispatch(toggleFullscreen(false))
      } else if(e.key === "Escape" && !fullscreen) {
        navigate(`/${category}`)
      }
    }

    window.addEventListener("keydown", escapeFullscreen)

    return () => {
      window.removeEventListener("keydown", escapeFullscreen)
    };
  }, [fullscreen])

  if (status === 'loading') {
    mediaElements = <p>Loading...</p>
  } else if (status === 'succeeded') {
    post && displayMedia(post)
  } else if (status === 'failed') {
    mediaElements = <div>{error}</div>
  }

  function displayMedia(post) {
    mediaElements = post.media.map((med) => {
      return <img src={med.url} key={med.publicId}/>
    })
  }

  // interaction
  const handleFullscreen = () => {
    dispatch(toggleFullscreen())
  }

  const handleScroll = (e) => {
    const headline = e.target.lastElementChild.firstElementChild;

    const headerRef = document.querySelector(".header-50")
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
    <div className={`post-container ${content ? "layout-50" : ""} ${fullscreen ? "layout-100" : ""}`}>
        {post.media &&
          <Carousel
            content={content}
            media={post.media}
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
