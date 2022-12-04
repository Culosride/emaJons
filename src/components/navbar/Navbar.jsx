import React, {useEffect, useState} from 'react'
import * as api from "../../API/index"

export default function Navbar(props) {
  const [categories, setCategories] = useState()

  // useEffect(() => {
  //   async function loadCategories() {
  //     const {data} = await api.getCategories()
  //     setCategories(data[0].name)
  //   }
  //   loadCategories()
  // }, [])

  return (
    <div className='navbarWrapper'>
      <h1>EMAJONS / </h1>
      <h1>{categories}</h1>
    </div>
  )
}
