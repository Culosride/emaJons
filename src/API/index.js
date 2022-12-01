import axios from 'axios';

const url = `http://localhost:${process.env.PORT}/posts`;

export const getPosts = () => axios.get(url);
