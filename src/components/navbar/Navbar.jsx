import React, {useEffect, useState} from 'react'

export default function Navbar(props) {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    async function loadCategories() {
      const response = await Axios.get("/rawPosts")
      setCategories(response.data)
    }
    loadCategories()
  }, [])

  return (
    <navabar>
      <h1>EMAJONS / </h1>
      <p>{categories}</p>
    </navabar>
  )
}
