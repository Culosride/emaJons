import React from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentCategory } from '../../features/posts/postsSlice';

export default function About() {
  const dispatch = useDispatch()

  dispatch(setCurrentCategory(("About")))

  return (
    <div className="about-container">
      <h1>About</h1>
    </div>
  )
}
