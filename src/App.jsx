import React, { useState, useEffect } from 'react';
import Category from './components/category/Category';
import PostForm from './components/postForm/PostForm';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import axios from 'axios';

export default function App() {

  return (
    <Router>
      <div className="App">
        <ul>
          <li><Link to="/walls">Walls</Link></li>
          <li><Link to="/sketchbooks">Sketchbooks</Link></li>
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
        </ul>
        <Routes>
          <Route exact path='/walls' element={<Category categoryName="walls" />}></Route>
          <Route exact path='/sketchbooks' element={<Category categoryName="sketchbooks" />}></Route>
          <Route exact path='/admin/dashboard' element={<PostForm />}></Route>
        </Routes>
      </div>
    </Router>
  )
}
