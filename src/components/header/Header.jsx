import React, {useState, useRef, useEffect} from "react"
import { Link, useLocation, matchPath, useNavigate } from 'react-router-dom'
import _ from 'lodash'
import { useDispatch, useSelector } from "react-redux";
import { deletePost, setCurrentCategory, fetchPosts, setScrollPosition } from '../../features/posts/postsSlice';
import { selectTag } from "../../features/tags/tagsSlice";
import useAuth from "../../hooks/useAuth.jsx";
import { logout } from "../../features/auth/authSlice"
import DropdownNav from "../dropdownNavigation/DropdownNav";
import { setModal } from "../../features/auth/authSlice";

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
  const screenSize = useSelector(state => state.posts.screenSize)
  const isSmallScreen = screenSize === "xs" || screenSize === "s"

  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if(error.includes("401")) handleLogout()
  }, [postsStatus])

  useEffect(() => {
    setIsExpanded(false)
  }, [pathname, screenSize])

  // to rename ?
  const admin = matchPath("/posts/*", pathname);
  const post = admin ? false : matchPath("/:categories/:postId", pathname)

  const logoAndCategoryRef = useRef()

  if(matchPath("/posts/new", pathname)) {
    currentCategory = "new post"
  } else if(matchPath("/posts/:postId/edit", pathname)) {
    currentCategory = "edit"
  }

  async function handleLogout() {
    localStorage.removeItem('access-token');
    dispatch(logout(token))
    .then(() => {
      navigate("/")})
  }

  const handleNewCategory = (category) => {
    setIsExpanded(false)
    dispatch(selectTag(""))
    dispatch(setScrollPosition(0))
    dispatch(setCurrentCategory(category))
  }

  const menuOff = () => {
    setIsExpanded(false)
  }

  const toggleMenu = () => {
    setIsExpanded(!isExpanded)
  }
  const handleLogin = () => {
    setIsExpanded(false)
    dispatch(setModal(true))
  }

  function handleDelete() {
    console.log(currentPostId, currentCategory);
    dispatch(deletePost([currentPostId, currentCategory]))
      .then(() => dispatch(fetchPosts()) && navigate(`/${currentCategory}`))
  }

  const adminMenu = () => {
    if(isAdmin) {
      return (
        <div className="admin-menu">
          <Link onClick={menuOff} className="new-post-btn" to={"/posts/new"}/>
          <button className="logout-btn" title="Logout" onClick={handleLogout}/>
        </div>
      )
    } else {
      return (
        <div className="admin-menu">
          {/* <Link  to={"/login"}> */}
            <button onClick={handleLogin} className="login-btn" title="Login"/>
          {/* </Link> */}
        </div>)
    }
  }

  const postMenu = () => {
    return (
      <div className="admin-menu">
        <button className="delete-btn" onClick={handleDelete}>Delete</button>
        <Link onClick={menuOff} className="edit-btn" to={`/posts/${currentPostId}/edit`}>
          <button type="button">Edit</button>
        </Link>
      </div>
    )
  }

  return (
    <>
      {!post &&
        <div className="header-100">
          <div ref={logoAndCategoryRef} className="logo-wrapper">
          <Link onClick={menuOff} to="/" className="logo">EmaJons</Link>
          <span className="dash"></span>
          {isSmallScreen && <div className="logo">{currentCategory}
          </div>}
        <DropdownNav
          isSmallScreen={isSmallScreen}
          isExpanded={isExpanded}
          toggleMenu={toggleMenu}
          handleNewCategory={handleNewCategory}
        />
      </div>
        {adminMenu()}
        </div>
      ||
      post && !isFullscreen &&
      <div className={`${hasContent ? 'header-50' : 'header-30 header-50'}`}>
          <div ref={logoAndCategoryRef} className="logo-wrapper">
            <Link onClick={menuOff} to="/" className="logo">EmaJons</Link>
            <span className="dash"></span>
            <Link to={`/${currentCategory}`}>{currentCategory}</Link>
          </div>
            {isAdmin && postMenu()}
      </div>
      }
    </>
  )
}
