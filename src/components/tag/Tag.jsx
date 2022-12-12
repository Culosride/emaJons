import React, { useState, useEffect } from 'react'

export default function Tag(props) {
  return (
    <div className='tag-wrapper'>
      <p onClick={() => props.toggleTag(props.name)} className="tag">{props.name}</p>
      <div onClick={() => props.handleTagDelete(props.name)} className='delete-tag'>X</div>
    </div>
  )
}
