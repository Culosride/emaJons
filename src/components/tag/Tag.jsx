import React, { useState, useEffect } from 'react'

export default function Tag({ handleSelectedTags, name, selected }) {
  // const [selected, setSelected] = useState(false)

  function handleClick() {
    // setSelected(!selected);
    handleSelectedTags(name)
  }
  return (
    <a href="#" className={selected ? 'tag-wrapper-selected tag-wrapper' : 'tag-wrapper'}>
      <p onClick={handleClick} className={selected ? 'selected tag' : 'tag'}>{name}</p>
      {/* {!props.selected && <i onClick={() => props.handleTagDelete(props.name)} className='delete-tag'></i>} */}
    </a>
  )
}
