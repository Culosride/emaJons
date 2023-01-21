import React, {useState, useRef, useEffect} from "react"
import { Link, useLocation, matchPath, useParams, useNavigate } from 'react-router-dom'
import _ from 'lodash'
import { useDispatch, useSelector } from "react-redux";
import { toggleNavbar } from "../../features/categories/categorySlice.js";
import { deletePost, editPost, setCurrentCategory } from '../../features/posts/postsSlice';
import useAuth from "../../hooks/useAuth.jsx";
import { logout, selectCurrentToken } from "../../features/auth/authSlice"

export default function Header () {
  const authorization = useAuth(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation();

  const path = pathname.split("/")[pathname.split("/").length-1]
  const isAdmin = authorization.isAdmin
  const token = useSelector(selectCurrentToken)
  const authStatus = useSelector(state => state.auth.status)

  // const isExpanded = useSelector(state => state.categories.isExpanded)
  let currentCategory = useSelector(state => state.posts.currentCategory)
  const isFullscreen = useSelector(state => state.posts.fullscreen)
  const currentPostId = useSelector(state => state.posts.selectedPost._id)

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

  const categories = ['walls', 'paintings', 'sketchbooks', 'video', 'sculptures']

  // missing cases, write for each condition
  if (!categories.includes(pathname.split("/")[1])) {
    currentCategory = path
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
  }

  const toggleNavBtn = {
    transform: isExpanded ? "translateX(0px) rotate(45deg)" : `translateX(${-navWidth + "px"}) rotate(0)`,
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
      .then(res => navigate("/"))
    setOn(false)
  }

  function handleDelete() {
    dispatch(deletePost([currentPostId, currentCategory, token]))
      .then(() => navigate(`/${currentCategory}`))
      // .then(() => dispatch(fetchPostsByCategory(currentCategory)))
  }

  const adminMenu = () => {
    if(isAdmin) {
      return (
        <ul className="adminMenu">
          <Link onClick={menuOff} className="newPostBtn" to={"/posts/new"}>New Post</Link>
          <button className="logoutBtn" title="Logout" onClick={handleLogout}>Logout</button>
        </ul>
      )
    } else {
      return (
        <ul className="adminMenu">
          <Link onClick={menuOff} className="loginBtn" to={"/login"}>Login</Link>
        </ul>)
    }
  }

  const postMenu = () => {
    return (
      <ul className="adminMenu">
        <button className="deleteBtn" onClick={handleDelete}>Delete Post</button>
        <Link onClick={menuOff} className="editBtn" to={`/posts/${currentPostId}/edit`}>Edit Post</Link>
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
        <ul className="header-global">
          <div ref={logoAndCategoryRef} className="logo-wrapper">
            <li onClick={menuOff}><Link to="/" className="logo">EmaJons</Link></li>
            <span className="dash"></span>
            <li className="logo">{currentCategory}</li>
          </div>
          <div className="rectangle" style={rectangleStyles}></div>
           <ul style={navStyles} ref={navRef} className="navigation">
              {navElements}
            </ul>
          <button onClick={toggleMenu} style={toggleNavBtn}><i className="close-icon"></i></button>
            {adminMenu()}
        </ul>
      ||
      post && !isFullscreen &&
      <ul className={`header-post`}>
          <div ref={logoAndCategoryRef} className="logo-wrapper">
            <li><Link onClick={menuOff} to="/" className="logo">EmaJons</Link></li>
            <span className="dash"></span>
            <li className="">{currentCategory}</li>
          </div>
          <div className="rectangle" style={rectangleStyles}></div>
          {/* <ul style={navStyles} ref={navRef} className="navigation">
            {navElements}
          </ul> */}
          {/* <button onClick={toggleMenu} style={toggleNavBtn}><i className="close-icon"></i></button> */}
              {/* <li><Link onClick={handleNewCategory} to="/posts/new">Dashboard</Link></li> */}
          {isAdmin && postMenu()}
          {<button onClick={() => navigate(-1)}><i className="close-icon"></i></button>}
        </ul>
      }
    </>
  )
}
