import axios from 'axios';

const url = "http://localhost:3000/posts"

export const fetchPosts = () => axios.get(url);
// export const getCategories = () => axios.get(`http://localhost:3000/rawCategories`)
