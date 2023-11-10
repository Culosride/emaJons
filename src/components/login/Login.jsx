import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../../features/auth/authSlice';
import Button from '../UI/Button';

function Login() {
  const status = useSelector(state => state.auth.status)
  const error = useSelector(state => state.auth.error)
  const usernameRef = useRef()
  const errRef = useRef()
  const [ userInfo, setUserInfo ] = useState({ username: "", password: "" })
  const [ errMsg, setErrMsg ] = useState("")

  useEffect(() => {
    usernameRef && usernameRef.current.focus()
  }, [])

  const navigate = useNavigate()
  const dispatch = useDispatch()

  function handleChange(e) {
    setErrMsg("");
    const { name, value } = e.target;
    setUserInfo((prev) => ({...prev, [name]: value}));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await dispatch(login(userInfo));

    if (!response.error) {
      const { accessToken } = response.payload;
      localStorage.setItem("access-token", accessToken);
      navigate(-1);
      resetInfo();
    } else {
      setErrMsg(error)
      errRef.current.focus();
    }
  }

  function resetInfo() {
    setUserInfo({
      username: "",
      password: ""
    });
  }

  const errClass = errMsg ? "error-msg" : "offscreen"     // defines styles when error

  const content = (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div ref={errRef} className={errClass} aria-live="assertive">{errMsg}</div>
        <label htmlFor="username">Username:</label>
        <input
            className="form__input"
            type="text"
            id="username"
            ref={usernameRef}
            name="username"
            value={userInfo.username}
            onChange={handleChange}
            autoComplete="off"
            required
        />

        <label htmlFor="password">Password:</label>
        <input
            className="form__input"
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
            value={userInfo.password}
            required
        />
          <Button type="btn-submit" className="btn-sign-in">Sign In</Button>
      </form>
    </div>
  )
  return content
}

export default Login
