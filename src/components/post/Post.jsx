import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFullscreen, setCurrentPost, fetchPostById } from '../../features/posts/postsSlice';
import Slider from '../slider/Slider';
import useKeyPress from "../../hooks/useKeyPress";

export default function Post() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const params = useParams()
  const currentId = params.postId
  const post = useSelector(state => state.posts.posts.find(post => post._id === currentId)) || useSelector(state => state.posts.currentPost)
  const status = useSelector(state => state.posts.status)
  const error = useSelector(state => state.posts.error)
  const category = params.category
  const fullscreen = useSelector(state => state.posts.fullscreen)
  const currentCategory = useSelector(state => state.posts.currentCategory)

  let mediaElements = []

  useEffect(() => {
    if(!post) {
      dispatch(fetchPostById(currentId))
    } else {
      dispatch(setCurrentPost(currentId))
    }
  }, [])

  const escapeFullscreen = () => {
    if (fullscreen) {
      dispatch(toggleFullscreen(false));
    } else {
      navigate(`/${category}`);
    }
  }

  useKeyPress("Escape", escapeFullscreen);

  if (status === 'loading') {
    mediaElements = <p>Loading...</p>
  } else if (status === 'succeeded') {
    post && displayMedia(post)
  } else if (status === 'failed') {
    mediaElements = <div>{error}</div>
  }

  function displayMedia(post) {
    mediaElements = post.media.map((med) => {
      return (<img src={med.url} key={med.publicId}/>)
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

  const content = post?.content && post.content.length > 500
  const cursorColor = fullscreen ? "white" : ""

  return (
    post &&
      (
        <div id={"post"} className={`post-container ${content ? "layout-50" : ""} ${fullscreen ? "layout-100 fullscreen" : ""}`}>
          {!fullscreen && <button className='close-btn' onClick={() => navigate(`/${currentCategory}`)}>
            <i className="close-icon"></i>
          </button>}
          {post.media && <Slider cursorColor={cursorColor} slides={post.media}/>}
          {!fullscreen && <div className="text-container" onScroll={handleScroll} onClick={handleFullscreen}>
            <div className="description-container">
              <div className="headline">
                <div>
                  <h1 className="title">{post.title}</h1>
                  {post.subtitle && <p className="subtitle">{post.subtitle}</p>}
                </div>
              </div>
              {post.content && <p className="content">{post.content}</p>}
            </div>
          </div>}
        </div>
      )
  )
}
