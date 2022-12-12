import axios from 'axios';

const url = "http://localhost:3000/posts"

export const fetchPosts = () => axios.get(url);
export const fetchPostsByCategory = (category) => axios.get(`/api/posts/${category}`);
export const fetchPostById = ({category, postId}) => axios.get(`/api/posts/${category}/${postId}`)
export const addPost = (data) => axios.post("/posts", (data), { headers: {'Content-Type': 'multipart/form-data'}})

export const fetchAllTags = () => axios.get("/api/categories/");
export const addNewTag = (tag) => axios.patch("/api/categories/tags", { newTag: tag })
export const deleteTag = (tagToDelete) => axios.patch("/api/categories/deleteTag", { tagToDelete: tagToDelete })
