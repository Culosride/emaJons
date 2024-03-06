import React, { useRef } from 'react';
import { useParams, useNavigate, useLoaderData } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFullscreen } from '../../features/UI/uiSlice';
import Slider from '../slider/Slider';
import useKeyPress from "../../hooks/useKeyPress";
import { fetchPostById } from '../../API';

export default function Post() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { postId, category } = useParams()
  const preLoadedPost = useLoaderData()
  const post = useSelector(state => state.posts.posts.find(post => post._id === postId)) || preLoadedPost

  const status = useSelector(state => state.posts.status)
  const error = useSelector(state => state.posts.error)
  const isFullscreen = useSelector(state => state.ui.isFullscreen)

  let mediaElements = []
  const headlineRef = useRef(null)

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
    post && displayMedia(post)
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

  const content = post?.content && post.content.length > 500
  const cursorColor = isFullscreen ? "white" : ""

  return (
    post &&
      (
        <main className={`post-container ${content ? "layout-50" : ""} ${isFullscreen ? "layout-100 fullscreen" : ""}`.trim()}>
          {post.media && <Slider content={content} cursorColor={cursorColor} slides={post.media}/>}
          {!isFullscreen && <div className="text-container" onScroll={handleScroll}>
            <section className="description-container">
              <div ref={headlineRef} className="headline">
                <h1 className="title">{post.title}</h1>
                {post.subtitle && <p className="subtitle">{post.subtitle}</p>}
              </div>
              {post.content && <p className="content">{post.content}</p>}
            </section>
          </div>}
        </main>
      )
  )
}

export async function loader({ params }) {
  const { category, postId } = params;
  const post = await fetchPostById({ category, postId });

  if (post.status === 404) {
    throw new Response("Not Found", { status: 404 });
  }

  return post.data
}
