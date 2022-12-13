import React, { useState, useEffect } from 'react'

export default function Tag(props) {
  const [selected, setSelected] = useState(false)

  function handleClick() {
    setSelected(!selected);
    props.toggleTag(props.name, selected)
  }

  return (
    <div className='tag-wrapper'>
      <p onClick={handleClick} className="tag">{props.name}</p>
      <div onClick={() => props.handleTagDelete(props.name)} className='delete-tag'>X</div>
    </div>
  )
}
