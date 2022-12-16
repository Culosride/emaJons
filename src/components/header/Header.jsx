import React from "react"
import { useSelector, useDispatch } from 'react-redux'; // hook to select data from redux store
import { Link, useLocation, matchPath } from 'react-router-dom'
import _ from 'lodash'
import { login, logout, refresh } from '../../features/auth/authSlice';

export default function Header () {
  const { pathname } = useLocation();
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const admin = matchPath("/admin/*", pathname);
  const post = admin ? false : matchPath("/:categories/:postId", pathname)

  const categories = ['walls', 'paintings', 'sketchbooks', 'video', 'sculpture', 'bio', 'contact', 'portfolio']
  // const about = ['bio', 'contact', 'portfolio']

  const navElements = categories.map((category, i) => (
    <li key={i}>
      <Link reloadDocument to={`/${category}`}>{_.capitalize(category)}</Link>
    </li>
  ))

  async function handleLogout() {
    console.log("asdd")
    dispatch(logout)
  }

  const logoutButton = (
    <button
        className="ilogoutbtncon-button"
        title="Logout"
        onClick={handleLogout}
    >Logout
    </button>
  )
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
            {logoutButton}
            <button><i className="close-icon"></i></button>
          </span>
        </ul>
      }
    </>
  )
}
