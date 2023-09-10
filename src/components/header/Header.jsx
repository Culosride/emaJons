import React, {useState, useRef, useEffect} from "react"
import { Link, useLocation, matchPath, useNavigate } from 'react-router-dom'
import _ from 'lodash'
import { useDispatch, useSelector } from "react-redux";
import { deletePost, setCurrentCategory, fetchPosts } from '../../features/posts/postsSlice';
import useAuth from "../../hooks/useAuth.jsx";
import { logout } from "../../features/auth/authSlice"
import { CATEGORIES } from "../../config/categories.js";

export default function Header () {
  const authorization = useAuth(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation();

  const isAdmin = authorization.isAdmin
  const token = localStorage.getItem('access-token');

  let currentCategory = useSelector(state => state.posts.currentCategory)
  const isFullscreen = useSelector(state => state.posts.fullscreen)
  const currentPostId = useSelector(state => state.posts.currentPost._id)
  const hasContent = useSelector(state => state.posts.currentPost.content?.length > 500)
  const postsStatus = useSelector(state => state.posts.status)
  const error = useSelector(state => state.posts.error)

  useEffect(() => {
    if(error.includes("401")) handleLogout()
  }, [postsStatus])

  // to rename ?
  const admin = matchPath("/posts/*", pathname);
  const post = admin ? false : matchPath("/:categories/:postId", pathname)

  // front-end state
  const [isExpanded, setIsExpanded] = useState(false)
  const [rectangleWidth, setRectangleWidth] = useState(0)
  const [navWidth, setNavWidth] = useState(0)
  const [on, setOn] = useState(false)
  const logoAndCategoryRef = useRef()
  const navRef = useRef()

  if(matchPath("/posts/new", pathname)) {
    currentCategory = "new post"
  }

  useEffect(() => {
    if(matchPath(":category", pathname) || matchPath("/posts/*", pathname)) {
      setRectangleWidth(logoAndCategoryRef.current.clientWidth)
      setNavWidth(navRef.current.clientWidth)
    }
  }, [currentCategory, pathname])

  const handleNewCategory = (category) => {
    setIsExpanded(!isExpanded)
    dispatch(setCurrentCategory(category))
  }

  const toggleMenu = () => {
    setIsExpanded(!isExpanded)
    setOn(true)
  }
  const menuOff = () => {
    setIsExpanded(false)
  }

  const toggleNavBtn = {
    transform: isExpanded ? "translateX(0px) rotate(45deg) " : `translateX(${-navWidth + "px"}) rotate(0)`,
    transition: on ? "all 0.5s ease-out" : ""
  }

  const navStyles = {
    transform: isExpanded ? "translateX(0px)" : `translateX(${-navWidth + "px"})`,
    transition: on ? "all 0.5s ease-out" : ""
  }

  const rectangleStyles = {
    width: rectangleWidth + 30 + "px"
  }

  async function handleLogout() {
    menuOff()
    localStorage.removeItem('access-token');
    dispatch(logout(token))
      .then(() => {
        navigate("/")})
    setOn(false)
  }

  async function handleDelete() {
    console.log(currentPostId, currentCategory)
    await dispatch(deletePost([currentPostId, currentCategory]))
    dispatch(fetchPosts()) && navigate(`/${currentCategory}`)
  }

  const adminMenu = () => {
    if(isAdmin) {
      return (
        <div className="admin-menu">
          <Link onClick={menuOff} className="new-post-btn" to={"/posts/new"}>New Post</Link>
          <button className="logout-btn" title="Logout" onClick={handleLogout}>Logout</button>
        </div>
      )
    } else {
      return (
        <div className="admin-menu">
          <Link onClick={menuOff} className="login-btn" to={"/login"}>Login</Link>
        </div>)
    }
  }

  const postMenu = () => {
    return (
      <div className="admin-menu">
        <button className="delete-btn" onClick={handleDelete}>Delete</button>
        <Link onClick={menuOff} className="edit-btn" to={`/posts/${currentPostId}/edit`}>Edit</Link>
      </div>
    )
  }

  const navElements = () => CATEGORIES.map((category, i) => {
    if((category) !== _.capitalize(currentCategory)) {
      return (
        <li key={i}>
          <Link onClick={() => handleNewCategory(category)} to={`/${category}`}>{_.capitalize(category)}</Link>
        </li>
      )
    }
  })

  return (
    <>
      {!post &&
        <div className="header-100">
          <div className="flex">
            <div ref={logoAndCategoryRef} className="logo-wrapper">
              <div onClick={menuOff}><Link to="/" className="logo">EmaJons</Link></div>
              <span className="dash"></span>
              <div className="logo">{currentCategory}</div>
            </div>
            <div className="rectangle" style={rectangleStyles}></div>
            <ul style={navStyles} ref={navRef} className="navigation">
              {navElements()}
            </ul>
            <button className='close-button' onClick={toggleMenu} style={toggleNavBtn}><i className="close-icon"></i></button>
          </div>
          {adminMenu()}
        </div>
      ||
      post && !isFullscreen &&
      <div className={`${hasContent ? 'header-50' : 'header-30 header-50'}`}>
          <div ref={logoAndCategoryRef} className="logo-wrapper">
            <div onClick={menuOff}><Link to="/" className="logo">EmaJons</Link></div>
            <span className="dash"></span>
            <Link to={`/${currentCategory}`}>{currentCategory}</Link>
          </div>
          <div>
            {isAdmin && postMenu()}
            <button className='close-button' onClick={() => navigate(currentCategory)}>
              <i className="close-icon"></i>
            </button>
          </div>
      </div>
      }
    </>
  )
}
