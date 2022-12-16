import axios from 'axios';

// const axiosInstance = axios.create({
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json"
//   }
// })

const url = "http://localhost:3000/posts"

// posts requests
export const fetchPosts = () => axios.get(url);
export const fetchPostsByCategory = (category) => axios.get(`/api/posts/${category}`);
export const fetchPostById = ({category, postId}) => axios.get(`/api/posts/${category}/${postId}`)
export const addPost = (formData, token) => axios.post("/posts", formData, { headers: {'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}`}})
export const deletePost = ([postId, category]) => axios.delete(`/${category}/${postId}`)

// tags requests
export const fetchAllTags = () => axios.get("/api/categories");
export const addNewTag = (tag) => axios.patch("/api/categories/tags", { newTag: tag })
export const deleteTag = (tagToDelete) => axios.patch("/api/categories/deleteTag", { tagToDelete: tagToDelete })

// auth requests
export const login = (userInfo) => axios.post("/auth", userInfo, { withCredentials: true })
export const logout = (token) => axios.post("/auth/logout", {cookies: token})
export const refresh = () => axios.get("/auth/refresh")
