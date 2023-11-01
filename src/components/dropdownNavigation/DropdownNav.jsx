import React, { useEffect, useRef } from "react";
import { CATEGORIES } from "../../config/categories.js";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../UI/Button.jsx";

const DropdownNav = ({ handleNewCategory, isSmallScreen,  toggleMenu,  isExpanded }) => {
  const currentCategory = useSelector((state) => state.posts.currentCategory);
  const screenSize = useSelector((state) => state.ui.screenSize);
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
          <Link
            onClick={() => handleNewCategory(category)}
            key={i} ref={(el) => (linksRef.current[i] = el)}
            className={isCurrentCategory ? "category-link nav-link active" : "category-link nav-link"}
            to={`/${category}`}
          >
            {_.capitalize(category)}
          </Link>
        );
      }
    });

  return (
    <>
      {isSmallScreen && <Button className={isExpanded ? "dropdown active" : "dropdown"} onClick={toggleMenu}/>}
      {
        <ul ref={navbarRef} className={isSmallScreen ? "navigation dropdown-menu" : "navigation"}>
          {navElements()}
        </ul>
      }
    </>
  );
};

export default DropdownNav;
