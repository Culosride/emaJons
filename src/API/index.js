import axios from 'axios';

const url = `http://localhost:3000/POSTS`

export const getPosts = () => axios.get(url);
export const getCategories = () => axios.get(`http://localhost:3000/rawCategories`)
