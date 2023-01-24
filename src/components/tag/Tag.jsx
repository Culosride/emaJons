import React, { useState, useEffect } from 'react'

export default function Tag(props) {
  // const [selected, setSelected] = useState(false)

  function handleClick() {
    // setSelected(!selected);
    props.handleTagToggle(props.name)
  }

  return (
    <a href="#" className={props.selected ? 'tag-wrapper-selected tag-wrapper' : 'tag-wrapper'}>
      <p onClick={handleClick} className={props.selected ? 'selected tag' : 'tag'}>{props.name}</p>
      {/* {!props.selected && <i onClick={() => props.handleTagDelete(props.name)} className='delete-tag'></i>} */}
    </a>
  )
}
