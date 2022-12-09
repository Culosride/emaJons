import React from "react"
import { Link, useNavigate, useLocation, matchPath } from 'react-router-dom'

export default function Header () {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const match = matchPath("/posts/:category/:postId", pathname);

  return (
    <>
      {match &&
        <ul className="header-post">
          <li><Link reloadDocument to="/" className="logo">EmaJons</Link></li>
          <button onClick={() => navigate(-1)}><i className="close-icon"></i></button>
        </ul> ||
        <ul className="header-global">
          <li><Link reloadDocument to="/" className="logo">EmaJons</Link></li>
          <li><Link reloadDocument to="/posts/walls">Walls</Link></li>
          <li><Link reloadDocument to="/posts/paintings">Paintings</Link></li>
          <li><Link reloadDocument to="/posts/sketchbooks">Sketchbooks</Link></li>
          <li><Link reloadDocument to="/posts/video">Video</Link></li>
          <li><Link reloadDocument to="/posts/sculpture">Sculpture</Link></li>
          <li><Link to="/bio">Bio</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="#">Portfolio</Link></li>
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
        </ul>
      }
    </>
  )
}
