import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from './components/layout/Layout';
import Login from './components/login/Login';
import AllPosts from './components/allPosts/AllPosts';
import PostForm from './components/postForm/PostForm';
import Post from './components/post/Post';
import Bio from './components/bio/Bio';
import Contact from './components/contact/Contact';
import Home from './components/home/Home';
import NotFound from './components/404/NotFound';
import withRouteValidation from "./hocs/RouteValidation";
import RequireAuth from './hocs/RequireAuth'
import { fetchPosts } from './features/posts/postsSlice';

import {
  Routes,
  Route,
} from 'react-router-dom';
import { ROLES } from './config/roles'

const AllPostsRouteValidated = withRouteValidation(AllPosts)
const PostRouteValidated = withRouteValidation(Post)
const PostFormRouteValidated = withRouteValidation(PostForm)

export default function App() {
  const dispatch = useDispatch();
  const posts = useSelector(state => state.posts.posts)

  useEffect(() => {
      console.log("fetching posts")
      dispatch(fetchPosts());
  }, []);

  return (
    <Routes>
      {/* public */}
      <Route index path="/" element={<Home />} />
      <Route path="/" element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path='/contact' element={<Contact />}/>
        <Route path='/bio' element={<Bio />}/>
        <Route path='/:category' element={<AllPostsRouteValidated /> } />
        {posts.length && <Route path="/:category/:postId" element={<PostRouteValidated posts={posts} />} />}
        {/* protected */}
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path='/posts/new' element={<PostForm />}/>
          <Route path='/posts/:postId/edit' element={<PostFormRouteValidated />}/>
        </Route>
        {/*end protected */}
        <Route path='/not-found' element={<NotFound />}/>
        <Route path='*' element={<NotFound />}/>
      </Route>
    </Routes>
  )
}
