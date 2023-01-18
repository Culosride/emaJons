import React from 'react';
import Header from './components/header/Header';
import Login from './components/login/Login';
import AllPosts from './components/allPosts/AllPosts';
import PostForm from './components/postForm/PostForm';
import Post from './components/post/Post';
import Bio from './components/bio/Bio';
import Contact from './components/contact/Contact';
import NotFound from './components/404/NotFound';
import withRouteValidation from "./hocs/RouteValidation"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

const AllPostsWrapped = withRouteValidation(AllPosts)
const PostWrapped = withRouteValidation(Post)

export default function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Navigate replace to="/walls" />} />
          <Route path="login" element={<Login />} />
          <Route path='/posts/new' element={<PostForm />}/>
          <Route path='/posts/:postId/edit' element={<PostForm />}/>
          <Route path='/:category' element={<AllPostsWrapped />} />
          <Route path="/:category/:postId" element={<PostWrapped />} />
          <Route path='/contact' element={<Contact />}/>
          <Route path='/bio' element={<Bio />}/>
          <Route path='*' element={<NotFound />}/>
        </Routes>
      </div>
    </Router>
  )
}
