import React, {useEffect} from "react";
import { CATEGORIES } from "../../config/categories.js";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const DropdownNav = ({ handleNewCategory, toggleMenu, isExpanded }) => {
  const currentCategory = useSelector(state => state.posts.currentCategory)
  const screenSize = useSelector(state => state.posts.screenSize)

  const isSmallScreen = screenSize === "xs" || screenSize === "s"

  useEffect(() => {
    const handleExpanded = () => {
      const links = document.querySelectorAll(".category-link")
      const navbar = document.querySelector(".dropdown")
      navbar && isExpanded && navbar.classList.add("show")
      navbar && !isExpanded && navbar.classList.remove("show")

      links.forEach((link, index) => {
        setTimeout(() => {
          isExpanded && link.classList.add("show") || !isSmallScreen && link.classList.remove("show") || !isExpanded && link.classList.remove("show")
        }, 100 * index)
      });
    }

    handleExpanded()

  }, [isExpanded, screenSize])

  const navElements = () => CATEGORIES.map((category, i) => {
    if((category) !== _.capitalize(currentCategory)) {
      return (
        <li className="category-link" key={i}>
          <Link onClick={() => handleNewCategory(category)} to={`/${category}`}>{_.capitalize(category)}</Link>
        </li>
      )
    }
  })

  return (
    <>
      {isSmallScreen && <button className='dropdown-button' onClick={toggleMenu}><i className="dropdown-icon"></i></button>}
      {<ul className={isSmallScreen ? "navigation dropdown" : "navigation"}>
        {navElements()}
      </ul>}
    </>)
}

export default DropdownNav
