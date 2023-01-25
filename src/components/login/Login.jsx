import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials, selectCurrentToken, login, refresh } from '../../features/auth/authSlice';

function Login() {
  const status = useSelector(state => state.auth.status)
  const error = useSelector(state => state.auth.error)
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

    dispatch(login(userInfo))
      .then(res => { if(!res.error) {
        dispatch(setCredentials(res.payload.accessToken));
        navigate(-1)
        resetInfo()
      } else {
        setErrMsg(error);
      }
    })

  errRef.current.focus();

}

function resetInfo() {
  setUserInfo({
    username: "",
    password: ""
  });
}

  const errClass = errMsg ? "error-msg" : "offscreen"     // defines styles when error

  const content = (
    <section>
      <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>
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
