import React from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentCategory } from '../../features/posts/postsSlice';

export default function Bio() {
  const dispatch = useDispatch()

  dispatch(setCurrentCategory(("About")))

  return (
    <div className="bio-container">
      <h1>Bio</h1>
    </div>
  )
}
