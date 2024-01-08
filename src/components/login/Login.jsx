import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../features/auth/authSlice';
import Button from '../UI/Button';
import ErrorMsg from '../UI/ErrorMsg';

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const usernameRef = useRef()
  const [ userInfo, setUserInfo ] = useState({ username: "", password: "" })
  const [ errMsg, setErrMsg ] = useState("")

  useEffect(() => {
    usernameRef?.current.focus()
  }, [])

  const handleChange = (e) => {
    setErrMsg("")
    const { name, value } = e.target;
    setUserInfo((prev) => ({...prev, [name]: value}));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await dispatch(login(userInfo)).unwrap()
      const { accessToken } = response;
      localStorage.setItem("access-token", accessToken);
      navigate(-1);
      resetInfo();
    } catch (error) {
      setErrMsg(error)
    }
  }

  const resetInfo = () => {
    setUserInfo({
      username: "",
      password: ""
    });
  }

  const content = (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
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
        <Button hasIcon={false} type="submit" className="sign-in">Sign In</Button>
        <ErrorMsg errMsg={errMsg} />
      </form>
    </div>
  )
  return content
}
