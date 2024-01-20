import axios from "axios";
import { store } from "../app/store";
import jwt_decode from "jwt-decode";
const baseURL = "http://localhost:3000"; // use exact spelling of "baseURL", axios default to prepend URLs

// posts requests
export const fetchPosts = () => axios.get("/api/posts");
export const fetchPostsByCategory = (category, pageNum) => axios.get(`/api/categories/${category}?page=${pageNum}`);
export const fetchPostById = (postId) => axios.get(`/api/posts/${postId}`);

export const createPost = (formData) => postInstance.post("/posts", formData);
export const editPost = (formData, postId) => postInstance.patch(`/posts/${postId}/edit`, formData);
export const deletePost = ([postId, category]) => postInstance.delete(`/${category}/${postId}`);

// post axios instance
const postInstance = axios.create({
  baseURL, // use exact spelling of baseURL, axios default to prepend URLs
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// post interceptor
postInstance.interceptors.request.use(async (req) => {
  const token = localStorage.getItem("access-token")
  const decoded = jwt_decode(token);
  const isExpired = decoded.exp < Date.now() / 1000;

  if (!isExpired) {
    req.headers.Authorization = `Bearer ${token}`;
    return req;
  }

  const response = await axios.get(`${baseURL}/auth/refresh`);
  req.headers.Authorization = `Bearer ${response.data.accessToken}`;
  return req;
});

// tags requests
export const fetchTags = () => axios.get("/api/tags");
export const createTag = (tag) => axios.patch("/api/tags", { newTag: tag });
export const deleteTag = (tagToDelete) => axios.patch("/api/tags/deleteTag", { tagToDelete: tagToDelete });

// auth requests
export const login = (userInfo) => axios.post("/auth", userInfo);
export const logout = () => axios.post("/auth/logout");
export const refresh = () => axios.get("/auth/refresh");
export const checkPath = (path) => axios.get(`/auth/validatePath${path}`);

// auth axios instance
const authInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// auth interceptor to request a refresh token
authInstance.interceptors.request.use(async (req) => {
  const token = store.getState().auth.token;
  const decoded = jwt_decode(token);
  const isExpired = decoded.exp < Date.now() / 1000;
  req.headers.Authorization = `Bearer ${token}`;
  if (!isExpired) return req;

  const response = await axios.get(`${baseURL}/auth/refresh`);

  req.headers.Authorization = `Bearer ${response.data.accessToken}`;
  return req;
});
