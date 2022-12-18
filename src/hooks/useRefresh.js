import axios from 'axios'
import jwt_decode from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentToken } from '../features/auth/authSlice';
import * as api from "../API/index"

const useRefresh = () => {
  const token = useSelector(selectCurrentToken)
  console.log("current selected token", token)
  const baseURL = "http://localhost:3000" // use exact spelling of baseURL, axios default to prepend URLs

  const axiosInstance = axios.create({
    baseURL,
    headers: {
      "withCredentials": true,
      "Content-Type": 'multipart/form-data',
      "Authorization": `Bearer ${token}`}
  });

  axiosInstance.interceptors.request.use(async req => {

    const isExpired = () => {
      const decoded = jwt_decode(token)
      return decoded.iat > Date.now()
    }

    if(!isExpired) return req
    console.log("expired",req)

    const {freshToken} = await axios.get(`${baseURL}/auth/refresh/`);
    console.log("freshtoken =", freshToken)

    req.headers.Authorization = `Bearer ${freshToken}`
    return req
  })

  return axiosInstance
}

export default useRefresh;
