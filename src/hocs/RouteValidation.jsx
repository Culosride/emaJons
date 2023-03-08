import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useParams } from "react-router-dom"
import { checkPath } from "../features/auth/authSlice"
import NotFound from '../components/404/NotFound';
import { resetStatus } from "../features/posts/postsSlice";


export default function withRouteValidation (Component) {

  return (props) => {
    const status = useSelector(state => state.auth.status)
    const location = useLocation()
    const params = useParams()
    const dispatch = useDispatch()

    useEffect(() => {
      dispatch(checkPath(location.pathname))
    }, [location.pathname, params])

    if (status === "failed") {
      return <NotFound />
    } else if (status === "succeeded") {
      return <Component {...props} />
    }
  }
}
