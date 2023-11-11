import React, { useEffect, useRef } from "react";
import { CATEGORIES } from "../../config/categories.js";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../UI/Button.jsx";

const DropdownNav = ({ handleNewCategory,  toggleMenu,  isExpanded }) => {
  const currentCategory = useSelector((state) => state.posts.currentCategory);
  const screenSize = useSelector((state) => state.ui.screenSize);
  const navbarRef = useRef(null);
  const linksRef = useRef([]);
  const isMediumScreen = screenSize === "xs" || screenSize === "s" || screenSize === "m";


  useEffect(() => {
    const handleExpanded = () => {
      linksRef.current.forEach((link, index) => {
        setTimeout(() => {
          (isExpanded && link?.classList.add("is-visible")) ||
          ((!isMediumScreen || !isExpanded) && link?.classList.remove("is-visible"))
        }, 100 * index);
      });
    };

    handleExpanded();
  }, [isExpanded, screenSize]);

  const navbarClass = `${isMediumScreen ? "nav-main__menu nav-main__menu--dropdown" : "nav-main__menu"} ${isExpanded && isMediumScreen ? "is-active" : ""}`

  const navElements = () =>
    CATEGORIES.map((category, i) => {
      const isCurrentCategory = currentCategory === category;

      if ((isMediumScreen && !isCurrentCategory) || !isMediumScreen) {
        return (
          <li
            key={i}
            ref={(el) => (linksRef.current[i] = el)}
            className={`nav-main__item ${isMediumScreen ? " nav-main__item--dropdown" : ""}`}
            >
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
      {isMediumScreen && <Button className={`btn--dropdown`} onClick={toggleMenu}>
        <span className={`icon icon--dropdown ${isExpanded ? "is-active" : ""}`}></span>
        </Button>}
      {
        <menu ref={navbarRef} className={navbarClass}>
          {navElements()}
        </menu>
      }
    </>
  );
};

export default DropdownNav;
