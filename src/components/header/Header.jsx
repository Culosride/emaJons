import React, { useState } from "react"
import { Link, useNavigate, useLocation, matchPath } from 'react-router-dom'
import _ from 'lodash'

export default function Header () {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const admin = matchPath("/admin/*", pathname);
  const post = admin ? false : matchPath("/:categories/:postId", pathname)

  const categories = ['walls', 'paintings', 'sketchbooks', 'video', 'sculpture']
  const about = ['bio', 'contact', 'portfolio']

  const postElements = categories.map((category, i) => (
    <li key={i}><Link reloadDocument to={`/${category}`}>{_.capitalize(category)}</Link></li>
  ))

  const aboutElements = about.map((nav, i) => (
    <li key={i}><Link to={`/${nav}`}>{_.capitalize(nav)}</Link></li>
  ))

  return (
    <ul className={post ? "header-post" : "header-global"}>
      <li><Link reloadDocument to="/" className="logo">EmaJons</Link></li>
      <span className="dash"></span>
      {post &&
        <button onClick={() => navigate(-1)}><i className="close-icon"></i></button> ||
        <span className="navigation">
          {postElements}
          {aboutElements}
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
          <button><i className="close-icon"></i></button>
        </span>
      }
    </ul>
  )
}
