import React from 'react'

export default function Tag({ handleTagToggle, handleTagDelete, tag, selected }) {

  function handleClick() {
    handleTagToggle(tag)
  }

  return (
    <div className={selected ? 'tag-wrapper-selected tag-wrapper' : 'tag-wrapper'}>
      <p onClick={handleClick} className={selected ? 'selected tag' : 'tag'}>{tag}</p>
      {!selected && <i onClick={() => handleTagDelete(tag)} className='delete-tag'></i>}
    </div>
  )
}
