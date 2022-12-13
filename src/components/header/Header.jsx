import React from "react"
import { Link } from 'react-router-dom'

export default function Header () {
  return (
    <ul className="header">
      <li><Link reloadDocument to="/walls">Walls</Link></li>
      <li><Link reloadDocument to="/paintings">Paintings</Link></li>
      <li><Link reloadDocument to="/sketchbooks">Sketchbooks</Link></li>
      <li><Link reloadDocument to="/video">Video</Link></li>
      <li><Link reloadDocument to="/sculpture">Sculpture</Link></li>
      <li><Link to="/bio">Bio</Link></li>
      <li><Link to="/contact">Contact</Link></li>
      <li><Link to="#">Portfolio</Link></li>
      <li><Link to="/admin/dashboard">Dashboard</Link></li>
    </ul>
  )
}
