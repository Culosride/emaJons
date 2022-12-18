import React from 'react';
import Header from './components/header/Header';
import Login from './components/login/Login';
import AllPosts from './components/allPosts/AllPosts';
import PostForm from './components/postForm/PostForm';
import Post from './components/post/Post';
import Bio from './components/bio/Bio';
import Contact from './components/contact/Contact';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';


export default function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route exact path='/:category' element={<AllPosts />} />
          <Route path="/:category/:postId" element={<Post />} />
          <Route exact path='/bio' element={<Bio />}></Route>
          <Route exact path='/contact' element={<Contact />}></Route>
          <Route path='/posts/new' element={<PostForm />}></Route>
        </Routes>
      </div>
    </Router>
  )
}
