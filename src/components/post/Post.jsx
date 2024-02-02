import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPostById } from '../../features/posts/postsSlice';
import { toggleFullscreen } from '../../features/UI/uiSlice';
import Slider from '../slider/Slider';
import useKeyPress from "../../hooks/useKeyPress";
import Button from '../UI/Button';

export default function Post() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { postId, category } = useParams()

  const currentPost = useSelector(state => state.posts.currentPost)
  const nextPostId = useSelector(state => state)
  console.log('nextPostId', nextPostId)

  const status = useSelector(state => state.posts.status)
  const error = useSelector(state => state.posts.error)
  const isFullscreen = useSelector(state => state.ui.isFullscreen)

  let mediaElements = []
  const headlineRef = useRef(null)

  useEffect(() => {
    if(status === "idle" || !currentPost) {
      dispatch(fetchPostById(postId))
    }
  }, [])

  const escapeFullscreen = () => {
    if (isFullscreen) {
      dispatch(toggleFullscreen(false));
    } else {
      navigate(`/${category}`);
    }
  }

  useKeyPress("Escape", escapeFullscreen);

  const displayMedia = (post) => {
    mediaElements = post.media.map((med) => {
      return (<img src={med.url} key={med.publicId}/>)
    })
  }

  if (status === 'loading') {
    mediaElements = <p>Loading...</p>
  } else if (status === 'succeeded') {
    currentPost && displayMedia(currentPost)
  } else if (status === 'failed') {
    mediaElements = <div>{error}</div>
  }

  const handleScroll = () => {
    const headline = headlineRef.current;
    const headerRef = document.querySelector(".header--50")
    if (headline.getBoundingClientRect().top < 60) {
      headline.classList.add('headline-sticky')
      headerRef.classList.add('fade-top')
    } else if (headline.getBoundingClientRect().top > 70) {
      headerRef.classList.remove('fade-top')
      headline.classList.remove('headline-sticky')
    }
  }

  const handlePreviousPost = () => {

  }

  const handleNextPost = () => {

  }

  const content = currentPost?.content && currentPost.content.length > 500
  const cursorColor = isFullscreen ? "white" : ""

  return (
    currentPost &&
      (
        <main id={"post"} className={`post-container ${content ? "layout-50" : ""} ${isFullscreen ? "layout-100 fullscreen" : ""}`}>
          {currentPost.media && <Slider content={content} cursorColor={cursorColor} slides={currentPost.media}/>}
          {!isFullscreen && <div className="text-container" onScroll={handleScroll}>
            <section className="description-container">
              <div ref={headlineRef} className="headline">
                <h1 className="title">{currentPost.title}</h1>
                {currentPost.subtitle && <p className="subtitle">{currentPost.subtitle}</p>}
              </div>
              {currentPost.content && <p className="content">{currentPost.content}</p>}
              <div className="posts-navigation">
                <Button hasIcon={false} className="prev-post" handlePreviousPost={handlePreviousPost}>
                  PREVIOUS
                </Button>
                <Button hasIcon={false} className="next-post" handleNextPost={handleNextPost}>
                  NEXT
                </Button>
              </div>
            </section>
          </div>}
        </main>
      )
  )
}
