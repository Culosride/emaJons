import React, {useState, useRef, useEffect} from "react"
import { Link, useLocation, matchPath, useParams, useNavigate } from 'react-router-dom'
import _ from 'lodash'
import { useDispatch, useSelector } from "react-redux";
import { toggleNavbar } from "../../features/categories/categorySlice.js";
import useAuth from "../../hooks/useAuth.jsx";
import { logout, selectCurrentToken } from "../../features/auth/authSlice"

export default function Header () {
  const dispatch = useDispatch()

  // const isExpanded = useSelector(state => state.categories.isExpanded)
  let currentCategory = useSelector(state => state.posts.currentCategory)
  const isFullscreen = useSelector(state => state.posts.fullscreen)


  const categories = ['walls', 'paintings', 'sketchbooks', 'video', 'sculptures']
  const { pathname } = useLocation();
  const navigate = useNavigate()

  const admin = matchPath("/posts/*", pathname);
  const post = admin ? false : matchPath("/:categories/:postId", pathname)
  const [isExpanded, setIsExpanded] = useState(false)
  const [rectangleWidth, setRectangleWidth] = useState(0)
  const [navWidth, setNavWidth] = useState(0)
  const [on, setOn] = useState(false)
  const authorization = useAuth(false)
  const isAdmin = authorization.isAdmin
  const token = useSelector(selectCurrentToken)
  const authStatus = useSelector(state => state.auth.status)
  const path = pathname.split("/")[1]

  const logoAndCategoryRef = useRef()
  const navRef = useRef()


  if (!categories.includes(path)) {
    currentCategory = path === "posts" ? "new post" : path
  }

  useEffect(() => {
    if(matchPath(":category", pathname) || matchPath("/posts/*", pathname)) {
      setRectangleWidth(logoAndCategoryRef.current.clientWidth)
      setNavWidth(navRef.current.clientWidth)
    }
  }, [currentCategory, pathname])

  const handleNewCategory = () => {
    setIsExpanded(!isExpanded)
  }

  const handleHover = () => {
    setHover(!hover)
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

  const adminMenu = () => {
    if(isAdmin) {
      return (
        <ul className="adminMenu">
          <Link onClick={menuOff} className="newPostBtn" to={"/posts/new"}>New Post</Link>
          {logoutButton}
        </ul>
      )
    } else {
      return (
        <ul className="adminMenu">
          <Link onClick={menuOff} className="loginBtn" to={"/login"}>Login</Link>
        </ul>)
    }
  }
  const logoutButton = (
    <button
        className="logoutBtn"
        title="Logout"
        onClick={handleLogout}
    >Logout
    </button>
  )


  const navElements = categories.map((category, i) => {
    if(category === "newPost") {
      return (
        <li key={i}>
          <Link onClick={handleNewCategory} to="/posts/new">{_.capitalize(category)}</Link>
        </li>
      )
    } else if(category !== currentCategory) {
      return (
        <li key={i}>
          <Link onClick={handleNewCategory} to={`/${category}`}>{_.capitalize(category)}</Link>
        </li>
      )
    }
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
          {<button onClick={() => navigate(-1)}><i className="close-icon"></i></button>}
        </ul>
      }
    </>
  )
}
