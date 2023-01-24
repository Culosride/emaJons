import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from './components/header/Header';
import Login from './components/login/Login';
import AllPosts from './components/allPosts/AllPosts';
import PostForm from './components/postForm/PostForm';
import Post from './components/post/Post';
import Bio from './components/bio/Bio';
import Contact from './components/contact/Contact';
import NotFound from './components/404/NotFound';
import withRouteValidation from "./hocs/RouteValidation";
import RequireAuth from './hocs/RequireAuth'
import { fetchPosts } from './features/posts/postsSlice';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ROLES } from './config/roles'

const AllPostsWrapped = withRouteValidation(AllPosts)
const PostWrapped = withRouteValidation(Post)

export default function App() {
  const dispatch = useDispatch();
  const posts = useSelector(state => state.posts.posts)

  useEffect(() => {
    if(!posts.length)
    dispatch(fetchPosts());
  }, [dispatch, posts.length]);

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          {/* public */}
          <Route path="/" element={<Navigate replace to="/walls" />} />
          <Route path="/login" element={<Login />} />
          <Route path='/contact' element={<Contact />}/>
          <Route path='/bio' element={<Bio />}/>
          <Route path='/:category' element={<AllPostsWrapped />} />
          <Route path="/:category/:postId" element={<PostWrapped />} />
          {/* protected */}
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path='/posts/new' element={<PostForm />}/>
            <Route path='/posts/:postId/edit' element={<PostForm />}/>
          </Route>
          {/*end protected */}
          <Route path='*' element={<NotFound />}/>
        </Routes>
      </div>
    </Router>
  )
}
