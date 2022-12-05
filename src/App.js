import React, { useState, useEffect } from 'react';
import Header from './components/header/Header';
import AllPosts from './components/allPosts/AllPosts';
import GridPost from './components/post/GridPost';
import PostForm from './components/postForm/PostForm';
import Post from './components/post/Post';
import Bio from './components/bio/Bio';
import Category from './components/category/Category';
import Contact from './components/contact/Contact';
import Navbar from './components/navbar/Navbar';

import { useDispatch } from 'react-redux';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route exact path='/:category' element={<AllPosts />} />
          <Route path="/:category/:postId" element={<Post />} />
          <Route exact path='/bio' element={<Bio />}></Route>
          <Route exact path='/contact' element={<Contact />}></Route>
          <Route exact path='/admin/dashboard' element={<PostForm />}></Route>
        </Routes>
      </div>
    </Router>
  )
}
