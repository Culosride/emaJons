import React, {useState, useRef, useEffect} from "react"
import { Link, useLocation, matchPath, useParams, useNavigate } from 'react-router-dom'
import _ from 'lodash'
import { useSelector } from "react-redux";

export default function Header () {
  const { pathname } = useLocation();
  const navigate = useNavigate()
  const admin = matchPath("/posts/*", pathname);
  const post = admin ? false : matchPath("/:categories/:postId", pathname)
  const isFullscreen = useSelector(state => state.posts.fullscreen)
  const [isExpanded, setIsExpanded] = useState(false)
  const [rectangleWidth, setRectangleWidth] = useState(0)
  const [navWidth, setNavWidth] = useState(0)

  const categories = ['walls', 'paintings', 'sketchbooks', 'video', 'sculpture', 'bio', 'contact', 'portfolio', "newPost"]
  const currentCategory = pathname.split("/")[1]

  const logoAndCategoryRef = useRef()
  const navRef = useRef()
  // workaround to offset navWidth dimension loss

  function prepareNavWidth(e) {
    setNavWidth(navRef.current.clientWidth-18)
  }

  useEffect(() => {
    setNavWidth(navRef.current.clientWidth)
    setRectangleWidth(logoAndCategoryRef.current.clientWidth);
  }, [currentCategory])

  const handleNewCategory = () => {
    setIsExpanded(false)
  }

  const toggleMenu = () => {
    setIsExpanded(!isExpanded)
  }

  const navStyles = {
    left: isExpanded ? rectangleWidth + 30 : rectangleWidth + 30 -navWidth,
  }

  const toggleNavBtn = {
    transform: isExpanded ? "rotate(45deg)" : ""
  }
  const rectangleStyles = {
    width: rectangleWidth + 30
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
          <Link style={{color: "#8F8F8F"}} onClick={handleNewCategory} to={`/${category}`}>{_.capitalize(category)}</Link>
        </li>
      )
    }
  })

  return (
    <>
      {!post &&
        <ul className="header-global">
          <div ref={logoAndCategoryRef} className="logo-wrapper">
            <li><Link to="/" className="logo">EmaJons</Link></li>
            <span className="dash"></span>
            <li className="logo">{currentCategory}</li>
          </div>
          <div className="rectangle" style={rectangleStyles}></div>
          <span style={navStyles} ref={navRef} onMouseEnter={prepareNavWidth} className="navigation">
              {navElements}
              <button onClick={toggleMenu} style={toggleNavBtn}><i className="close-icon"></i></button>
          </span>
          {/* <li className="dashboard-link" ><Link onClick={handleNewCategory} to="/posts/new">Dashboard</Link></li> */}
        </ul>
      ||
      post && !isFullscreen &&
        <ul className={`header-post`}>
          <div ref={logoAndCategoryRef} className="logo-wrapper">
            <li><Link to="/" className="logo">EmaJons</Link></li>
            <span className="dash"></span>
            <li className="logo">{currentCategory}</li>
          </div>
          <div className="rectangle" style={rectangleStyles}></div>
          <span style={navStyles} ref={navRef} onMouseEnter={prepareNavWidth} className="navigation">
              {/* <li><Link onClick={handleNewCategory} to="/posts/new">Dashboard</Link></li> */}
              {<button onClick={() => navigate(-1)}><i className="close-icon"></i></button>}
          </span>
        </ul>
      }
    </>
  )
}
