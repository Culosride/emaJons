import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { refresh, selectCurrentToken, selectAuthStatus } from '../../features/auth/authSlice'


function PersistLogin() {
  const token = useSelector(selectCurrentToken)
  const status = useSelector(selectAuthStatus)
  const dispatch = useDispatch()

  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const verifyRefreshToken = async () => {
      console.log("verifying ref token")
      try {
        dispatch(refresh(token));
        setSuccess(true)
      } catch (error) {
        console.log("err at persist login",error)
      }

      if(!token) verifyRefreshToken()
    }
  }, [])

  let content
  if (status === "succeeded" && success) {
    content = <Outlet />
    return content.unwrap()
  } else if (token && status === "idle") {
    console.log("token and idle")
    content = <Outlet />
    return content.unwrap()
  }

  return content
}

export default PersistLogin
