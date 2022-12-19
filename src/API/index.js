import axios from 'axios';
const baseURL = "http://localhost:3000" // use exact spelling of baseURL, axios default to prepend URLs
import { store } from '../app/store';
import jwt_decode from "jwt-decode";

// posts requests
export const fetchPosts = (token) => postInstance(token).get();
export const fetchPostsByCategory = (category) => axios.get(`/api/posts/${category}`);
export const fetchPostById = ({category, postId}) => axios.get(`/api/posts/${category}/${postId}`)

export const addPost = (formData) => postInstance.post("/posts", formData)
export const deletePost = ([postId, category, token]) => postInstance(token).delete(`/${category}/${postId}`)

const postInstance = axios.create({
  baseURL, // use exact spelling of baseURL, axios default to prepend URLs
  withCredentials: true,
  headers: {
    "Content-Type": 'multipart/form-data',
  }
})

postInstance.interceptors.request.use(async req => {
  const token = store.getState().auth.token
  console.log(token)
  const decoded = jwt_decode(token)
  const isExpired = decoded.exp < Date.now()/1000
  console.log(isExpired)

  if(!isExpired) {
    req.headers.Authorization = `Bearer ${token}`
    return req
  }
  
  const response = await axios.get(`${baseURL}/auth/refresh/`);
  req.headers.Authorization = `Bearer ${response.data.accessToken}`
  return req
})


// tags requests
export const fetchAllTags = () => axios.get("/api/categories");
export const addNewTag = (tag) => axios.patch("/api/categories/tags", { newTag: tag })
export const deleteTag = (tagToDelete) => axios.patch("/api/categories/deleteTag", { tagToDelete: tagToDelete })

// auth requests
export const login = (userInfo) => axios.post("/auth", userInfo)
export const logout = () => axios.post("/auth/logout")
export const refresh = () => axios.get("/auth/refresh")

// auth axios instance
const authInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  }
})

// auth interceptor
authInstance.interceptors.request.use(async req => {
  const token = store.getState().auth.token
  const decoded = jwt_decode(token)
  const isExpired = decoded.exp < Date.now()/1000
  req.headers.Authorization = `Bearer ${token}`
  if(!isExpired) return req

  const response = await axios.get(`${baseURL}/auth/refresh/`);

  req.headers.Authorization = `Bearer ${response.data.accessToken}`
  return req
})
