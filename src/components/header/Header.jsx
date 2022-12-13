import React from "react"
import { Link } from 'react-router-dom'

export default function Header () {
  return (
    <ul className="header">
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
  )
}
