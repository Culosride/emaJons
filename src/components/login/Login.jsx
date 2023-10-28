import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, setModal } from '../../features/auth/authSlice';
import Modal from '../UI/Modal';

function Login() {
  const status = useSelector(state => state.auth.status)
  const error = useSelector(state => state.auth.error)
  const isModalOpen = useSelector(state => state.auth.isModalOpen)
  const usernameRef = useRef()
  const errRef = useRef()
  const [ userInfo, setUserInfo ] = useState({ username: "", password: "" })
  const [ errMsg, setErrMsg] = useState("")


  useEffect(() => {
    usernameRef && usernameRef.current.focus()
  }, [])

  const navigate = useNavigate()
  const dispatch = useDispatch()

  function handleChange(e) {
    setErrMsg('');
    const { name, value } = e.target;
    setUserInfo((prev) => ({...prev, [name]: value}));
  }

  async function handleSubmit(e) {
    e.preventDefault()

    dispatch(login(userInfo))
      .then(res => { if(!res.error) {
        localStorage.setItem("access-token", res.payload.accessToken)
        navigate(-1)
        resetInfo()
      } else {
        setErrMsg(error);
      }
    })

  errRef.current.focus();

}

const handleClose = () => {
  dispatch(setModal(false))
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
        <div className="actions-btns">
          <button className="form__submit-button">Sign In</button>
          <button onClick={handleClose}>Close</button>
        </div>

      </form>
    </section>
  )
  return (
    <Modal className='login' open={isModalOpen}>
      {content}
    </Modal>
  )
}

export default Login
