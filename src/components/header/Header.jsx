import React, {useState, useRef, useEffect} from "react"
import { Link, useLocation, matchPath, useParams, useNavigate } from 'react-router-dom'
import _ from 'lodash'
import { useDispatch, useSelector } from "react-redux";
import { toggleNavbar } from "../../features/categories/categorySlice.js";

export default function Header () {
  const dispatch = useDispatch()

  // const isExpanded = useSelector(state => state.categories.isExpanded)
  const currentCategory = useSelector(state => state.categories.currentCategory)
  const isFullscreen = useSelector(state => state.posts.fullscreen)


  const { pathname } = useLocation();
  const navigate = useNavigate()
  // const currentCategory = pathname.split("/")[1]

  const admin = matchPath("/posts/*", pathname);
  const post = admin ? false : matchPath("/:categories/:postId", pathname)
  const [isExpanded, setIsExpanded] = useState(false)
  const [rectangleWidth, setRectangleWidth] = useState(0)
  const [navWidth, setNavWidth] = useState(0)
  const [on, setOn] = useState(false)

  const categories = ['walls', 'paintings', 'sketchbooks', 'video', 'sculpture']

  const logoAndCategoryRef = useRef()
  const navRef = useRef()

  useEffect(() => {
    setRectangleWidth(logoAndCategoryRef.current.clientWidth)
    setNavWidth(navRef.current.clientWidth)
  }, [currentCategory])

  const handleNewCategory = () => {
    // dispatch(toggleNavbar())
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
    // dispatch(toggleNavbar())
    setIsExpanded(false)
    // setNavWidth(navRef.current.clientWidth)
    // setOn(false)
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
          {/* <li className="dashboard-link" ><Link onClick={handleNewCategory} to="/posts/new">Dashboard</Link></li> */}
        </ul>
      ||
      post && !isFullscreen &&
      <ul className={`header-post`}>
          <div ref={logoAndCategoryRef} className="logo-wrapper">
            <li onClick={menuOff}><Link to="/" className="logo">EmaJons</Link></li>
            <span className="dash"></span>
            <li className="">{currentCategory}</li>
          </div>
          <div className="rectangle" style={rectangleStyles}></div>
          <ul style={navStyles} ref={navRef} className="navigation">
            {navElements}
          </ul>
          <button onClick={toggleMenu} style={toggleNavBtn}><i className="close-icon"></i></button>
              {/* <li><Link onClick={handleNewCategory} to="/posts/new">Dashboard</Link></li> */}
          {/* {<button onClick={() => navigate(-1)}><i className="close-icon"></i></button>} */}
        </ul>
      }
    </>
  )
}
