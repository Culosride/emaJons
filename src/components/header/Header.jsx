import React from "react"
import { Link, useLocation, matchPath } from 'react-router-dom'
import _ from 'lodash'

export default function Header () {
  const { pathname } = useLocation();
  const admin = matchPath("/admin/*", pathname);
  const post = admin ? false : matchPath("/:categories/:postId", pathname)

  const categories = ['walls', 'paintings', 'sketchbooks', 'video', 'sculpture', 'bio', 'contact', 'portfolio']
  // const about = ['bio', 'contact', 'portfolio']

  const navElements = categories.map((category, i) => (
    <li key={i}>
      <Link reloadDocument to={`/${category}`}>{_.capitalize(category)}</Link>
    </li>
  ))

  // const aboutElements = about.map((nav, i) => (
  //   <li key={i}><Link to={`/${nav}`}>{_.capitalize(nav)}</Link></li>
  // ))

  return (
    <>
      {!post &&
        <ul className="header-global">
          <li><Link reloadDocument to="/" className="logo">EmaJons</Link></li>
          <span className="dash"></span>
          <span className="navigation">
            {navElements}
            {/* {aboutElements} */}
            <li><Link to="/posts/new">Dashboard</Link></li>
            <button><i className="close-icon"></i></button>
          </span>
        </ul>
      }
    </>
  )
}
