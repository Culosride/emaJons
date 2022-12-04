import React from 'react';
import AllPosts from './components/allPosts/AllPosts';
import PostForm from './components/postForm/PostForm';
import Post from './components/post/Post';
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
        <ul>
          <li><Link reloadDocument to="/walls">Walls</Link></li>
          <li><Link reloadDocument to="/sketchbooks">Sketchbooks</Link></li>
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
        </ul>
        <Routes>
          <Route exact path='/:category' element={<AllPosts />} />
          <Route path="/:category/:postId" element={<Post />} />
          <Route exact path='/admin/dashboard' element={<PostForm />}></Route>
        </Routes>
      </div>
    </Router>
  )
}
