import React, {useState, useRef, useEffect} from "react"
import { Link, useLocation, matchPath, useParams, useNavigate } from 'react-router-dom'
import _ from 'lodash'
import { useDispatch, useSelector } from "react-redux";
import { toggleNavbar } from "../../features/categories/categorySlice.js";
import { deletePost, editPost, setCurrentCategory, fetchPosts, setCurrentPost } from '../../features/posts/postsSlice';
import useAuth from "../../hooks/useAuth.jsx";
import { logout, selectCurrentToken } from "../../features/auth/authSlice"
import { current } from "@reduxjs/toolkit";

export default function Header () {
  const authorization = useAuth(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation();

  const isAdmin = authorization.isAdmin
  const token = useSelector(selectCurrentToken)

  // const isExpanded = useSelector(state => state.categories.isExpanded)
  let currentCategory = useSelector(state => state.posts.currentCategory)
  const isFullscreen = useSelector(state => state.posts.fullscreen)
  const currentPostId = useSelector(state => state.posts.selectedPost._id)
  const hasContent = useSelector(state => state.posts.selectedPost.content?.length > 800)

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

  const categories = ['Walls', 'Paintings', 'Sketchbooks', 'Video', 'Sculptures']

  if(pathname.includes("new")) {
    currentCategory = "New Post"
  } else if(pathname.includes("edit")) {
    currentCategory = "edit"
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
    // dispatch(toggleNavbar())
    setIsExpanded(!isExpanded)
    setOn(true)
  }
  const menuOff = () => {
    setIsExpanded(false)
    // dispatch(setCurrentPost(""))
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
    dispatch(logout(token))
      .then(() => navigate("/"))
    setOn(false)
  }

  function handleDelete() {
    dispatch(deletePost([currentPostId, currentCategory, token]))
    .then(() => dispatch(fetchPosts()) && navigate(`/${currentCategory}`))
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
      <ul className="admin-menu">
        <button className="delete-btn" onClick={handleDelete}>Delete</button>
        <Link onClick={menuOff} className="edit-btn" to={`/posts/${currentPostId}/edit`}>Edit</Link>
      </ul>
    )
  }

  const navElements = categories.map((category, i) => {
      return (
        <li key={i}>
          <Link onClick={() => handleNewCategory(category)} to={`/${category}`}>{_.capitalize(category)}</Link>
        </li>
      )
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
              {navElements}
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
            <button className='close-button' onClick={() => navigate(-1)}>
              <i className="close-icon"></i>
            </button>
          </div>
          {/* <div className="rectangle" style={rectangleStyles}></div> */}
          {/* <ul style={navStyles} ref={navRef} className="navigation">
            {navElements}
          </ul> */}
          {/* <button onClick={toggleMenu} style={toggleNavBtn}><i className="close-icon"></i></button> */}
          {/* <li><Link onClick={handleNewCategory} to="/posts/new">Dashboard</Link></li> */}
      </div>
      }
    </>
  )
}
