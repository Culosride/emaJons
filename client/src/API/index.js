import axios from "axios";
import jwt_decode from "jwt-decode";

// posts requests
export const fetchPosts = () => axios.get("/api/posts");
export const fetchPostsByCategory = ({ category, pageNum }) => axios.get(`/api/posts?category=${category}&page=${pageNum}`);
export const fetchPostById = ({ category, postId }) => axios.get(`/api/posts/${category}/${postId}`);

export const createPost = (formData) => postInstance.post("/api/posts", formData);
export const editPost = (formData, postId) => postInstance.patch(`/api/posts/${postId}/edit`, formData);
export const deletePost = (postId) => postInstance.delete(`/api/posts/${postId}`);

// post axios instance
const postInstance = axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// post interceptor
postInstance.interceptors.request.use(async (req) => {
  const token = localStorage.getItem("access-token");
  const decoded = jwt_decode(token);
  const isExpired = decoded.exp < Date.now() / 1000;

  if (!isExpired) {
    req.headers.Authorization = `Bearer ${token}`;
    return req;
  }

  const response = await axios.get("/api/auth/refresh");
  localStorage.setItem("access-token", response.data.accessToken);

  req.headers.Authorization = `Bearer ${response.data.accessToken}`;
  return req;
});

// tags requests
export const fetchTags = () => axios.get("/api/tags");
export const createTag = (tag) => axios.post("/api/tags", { newTag: tag });
export const deleteTag = (tagToDelete) => axios.delete(`/api/tags/${tagToDelete}`);

// auth requests
export const login = (userInfo) => axios.post("/api/auth", userInfo);
export const logout = () => axios.post("/api/auth/logout");
export const refresh = () => axios.get("/api/auth/refresh");
export const checkPath = (path) => axios.get(`/api/auth/validatePath${path}`);
