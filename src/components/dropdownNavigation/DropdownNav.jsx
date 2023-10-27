import React, { useEffect, useRef } from "react";
import { CATEGORIES } from "../../config/categories.js";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const DropdownNav = ({ handleNewCategory, isSmallScreen,  toggleMenu,  isExpanded }) => {
  const currentCategory = useSelector((state) => state.posts.currentCategory);
  const screenSize = useSelector((state) => state.posts.screenSize);
  const navbarRef = useRef(null);
  const linksRef = useRef([]);

  useEffect(() => {
    const handleExpanded = () => {
      isExpanded && navbarRef.current.classList.add("show");
      !isExpanded && navbarRef.current.classList.remove("show");

      linksRef.current.forEach((link, index) => {
        setTimeout(() => {
          (isExpanded && link?.classList.add("show")) ||
          ((!isSmallScreen || !isExpanded) && link?.classList.remove("show"))
        }, 100 * index);
      });
    };

    handleExpanded();
  }, [isExpanded, screenSize]);

  const navElements = () =>
    CATEGORIES.map((category, i) => {
      const isCurrentCategory = currentCategory === category;

      if ((isSmallScreen && !isCurrentCategory) || !isSmallScreen) {
        return (
          <li key={i} ref={(el) => (linksRef.current[i] = el)} className="category-link">
            <Link
              className={isCurrentCategory ? "nav-link active" : "nav-link"}
              onClick={() => handleNewCategory(category)}
              to={`/${category}`}
            >
              {_.capitalize(category)}
            </Link>
          </li>
        );
      }
    });

  return (
    <>
      {isSmallScreen && (
        <button className="dropdown-button" onClick={toggleMenu}>
          <i className={isExpanded ? "dropdown-icon active" : "dropdown-icon"}></i>
        </button>
      )}
      {
        <ul ref={navbarRef} className={isSmallScreen ? "navigation dropdown" : "navigation"}>
          {navElements()}
        </ul>
      }
    </>
  );
};

export default DropdownNav;
