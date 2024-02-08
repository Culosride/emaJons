import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useParams } from "react-router-dom"
import { checkPath } from "../features/auth/authSlice"
import ErrorPage from '../components/errorPage/ErrorPage';

export default function withRouteValidation (Component) {

  return (props) => {
    const status = useSelector(state => state.auth.status)
    const { pathname } = useLocation()
    const { category, postId } = useParams()
    const dispatch = useDispatch()

    useEffect(() => {
      dispatch(checkPath(pathname))
    }, [pathname, category, postId])

    if (status === "failed") {
      return <ErrorPage />
    } else if (status === "succeeded") {
      return <Component {...props} />
    }
  }
}
