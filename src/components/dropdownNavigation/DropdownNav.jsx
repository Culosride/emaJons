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
      linksRef.current.forEach((link, index) => {
        setTimeout(() => {
          (isExpanded && link?.classList.add("show")) ||
          ((!isSmallScreen || !isExpanded) && link?.classList.remove("show"))
        }, 100 * index);
      });
    };

    handleExpanded();
  }, [isExpanded, screenSize]);

  const navbarClass = `${isSmallScreen ? "nav-main__menu nav-main__dropdown" : "nav-main__menu"}${isExpanded && isSmallScreen ? "--show" : ""}`

  const navElements = () =>
    CATEGORIES.map((category, i) => {
      const isCurrentCategory = currentCategory === category;

      if ((isSmallScreen && !isCurrentCategory) || !isSmallScreen) {
        return (
          <li key={i} ref={(el) => (linksRef.current[i] = el)} className="nav-main__item">
            <Link
              onClick={() => handleNewCategory(category)}
              className={isCurrentCategory ? "nav-main__link nav-main__link--small is-active" : "nav-main__link nav-main__link--small"}
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
      {isSmallScreen && <Button className={isExpanded ? "dropdown active" : "dropdown"} onClick={toggleMenu}>
        <span className="icon icon--dropdown"></span>
        </Button>}
      {
        <ul ref={navbarRef} className={navbarClass}>
          {navElements()}
        </ul>
      }
    </>
  );
};

export default DropdownNav;
