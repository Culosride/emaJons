import React, { useState, useEffect, useRef } from 'react';
// import Axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Carousel from '../carousel/Carousel';
import { useSelector, useDispatch } from 'react-redux'; // hook to select data from state (in redux store)
import { fetchPostById } from '../../features/posts/postsSlice';

export default function Post() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const post = useSelector(state => state.posts.selectedPost)
  const params = useParams()
  const status = useSelector(state => state.posts.status)
  const error = useSelector(state => state.posts.error)

  const textContainer = useRef(null)
  const [initialPosition, setInitialPosition] = useState(0)

  useEffect(() => {
    setInitialPosition(textContainer.current.clientHeight * .6);
  }, [])

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

  const handleScroll = (e) => {
    const headline = e.target.lastElementChild.firstElementChild;
    const scrollTop = headline.offsetTop;
    (scrollTop > initialPosition) ? headline.classList.add('headline-sticky') : headline.classList.remove('headline-sticky')
  }

  const toggleFullScreen = (e) => {
    const postContainer = document.querySelector('.post-container')
    postContainer.classList.toggle('layout-100')
  }

  const content = post.content && post.content.length > 100

  return (
      <div className={content ? "post-container layout-50" : "post-container"}>
        {post.images &&
          <Carousel content={content} images={post.images} toggleFullScreen={toggleFullScreen}></Carousel>
        }
        <div
          ref={textContainer}
          className="text-container text-container-50"
          onScroll={handleScroll}
          onClick={toggleFullScreen}
        >
          <div className="header-post header-post-50">
            <Link reloadDocument to="/" className="logo">EmaJons</Link>
          </div>
          <button onClick={() => navigate(-1)}><i className="close-icon"></i></button>
          <div className="description-container-50 description-container" >
            <div className="headline headline-50">
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
