import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Category from './components/category/Category';
import GridPost from './components/post/GridPost';
import Navbar from './components/navbar/Navbar';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import { getPosts } from "./actions/posts"

export default function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getPosts())
  }, [dispatch])

  return (
    <Router>
      <div className="App">
        <ul>
          <li><Link to="/walls">Walls</Link></li>
          <li><Link to="/sketchbooks">Sketchbooks</Link></li>
        </ul>
        <Routes>
          <Route exact path='/walls' element={<Category categoryName="walls" />}></Route>
          <Route exact path='/grid' element={<GridPost categoryName="" />}></Route>
          <Route exact path='/categories' element={<Navbar />}></Route>
          <Route exact path='/sketchbooks' element={<Category categoryName="sketchbooks" />}></Route>
        </Routes>
      </div>
    </Router>
  )
}
