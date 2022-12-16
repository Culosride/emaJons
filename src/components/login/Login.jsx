import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, refresh } from '../../features/auth/authSlice';


function Login() {
  const status = useSelector(state => state.auth.status)
  const token = useSelector(state => state.auth.token)
  const userRef = useRef()
  const errRef = useRef()
  const [ userInfo, setUserInfo ] = useState({ username: "", password: "" })
  const [ errMsg, setErrMsg] = useState("")

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
      setErrMsg('');
  }, [userInfo.username, userInfo.password])

  const navigate = useNavigate()
  const dispatch = useDispatch()

  function handleChange(e) {
    const { name, value } = e.target;
    setUserInfo((prev) => ({...prev, [name]: value}));
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      dispatch(login(userInfo))
      setUserInfo({
        username: "",
        password: ""
      })
      navigate("/posts/new")
    } catch (err) {
      if (!err.status) {
          setErrMsg('No Server Response');
      } else if (err.status === 400) {
          setErrMsg('Missing Username or Password');
      } else if (err.status === 401) {
          setErrMsg('Unauthorized');
      } else {
          setErrMsg(err.data?.message);
      }
      errRef.current.focus();
    }
  }

  const errClass = errMsg ? "error-msg" : "offscreen"     // defines styles when error

  const content = (
    <section>
      <p ref={errRef} className={errClass} aria-live="assertive">{userInfo.errMsg}</p>
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
            className="form__input"
            type="text"
            id="username"
            ref={userRef}
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
        <button className="form__submit-button">Sign In</button>

      </form>
    </section>
  )
  return content
}

export default Login
