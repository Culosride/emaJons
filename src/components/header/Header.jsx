import React from "react"
import { useSelector, useDispatch } from 'react-redux'; // hook to select data from redux store
import { Link, useLocation, matchPath } from 'react-router-dom'
import _ from 'lodash'
import { selectCurrentToken, login, logout, refresh } from '../../features/auth/authSlice';


export default function Header () {
  const { pathname } = useLocation();
  const admin = matchPath("/posts/*", pathname);
  const dispatch = useDispatch()
  const token = useSelector(selectCurrentToken)
  const post = admin ? false : matchPath("/:categories/:postId", pathname)

  const categories = ['walls', 'paintings', 'sketchbooks', 'video', 'sculpture', 'bio', 'contact', 'portfolio']
  // const about = ['bio', 'contact', 'portfolio']

  const navElements = categories.map((category, i) => (
    <li key={i}>
      <Link to={`/${category}`}>{_.capitalize(category)}</Link>
    </li>
  ))

  return (
    <>
      {!post &&
        <ul className="header-global">
          <li><Link to="/" className="logo">EmaJons</Link></li>
          <span className="dash"></span>
          <span className="navigation">
            {navElements}
            <li><Link to="/posts/new">Dashboard</Link></li>
            <button><i className="close-icon"></i></button>
          </span>
        </ul>
      }
    </>
  )
}
