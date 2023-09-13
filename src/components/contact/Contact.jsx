import React from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentCategory } from '../../features/posts/postsSlice';

export default function Contact() {
  const dispatch = useDispatch()

  dispatch(setCurrentCategory(("Contact")))
  return (
    <div className="contact-container">
      <h1>Contact</h1>
    </div>
  )
}
