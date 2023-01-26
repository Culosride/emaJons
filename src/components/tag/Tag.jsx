import React from 'react'

export default function Tag({ handleTagToggle, handleTagDelete, name, selected }) {

  function handleClick() {
    // setSelected(!selected);
    handleTagToggle(name)
  }
  return (
    <a href="#" className={selected ? 'tag-wrapper-selected tag-wrapper' : 'tag-wrapper'}>
      <p onClick={handleClick} className={selected ? 'selected tag' : 'tag'}>{name}</p>
      {!selected && <i onClick={() => handleTagDelete(name)} className='delete-tag'></i>}
    </a>
  )
}
