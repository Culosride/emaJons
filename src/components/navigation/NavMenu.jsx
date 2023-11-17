import React, { useEffect, useRef } from "react";
import { CATEGORIES } from "../../config/categories.js";
import { useSelector } from "react-redux";
import { Link, matchPath, useLocation } from "react-router-dom";
import Button from "../UI/Button.jsx";

const NavMenu = ({ handleNewCategory,  toggleMenu,  isExpanded }) => {
  let currentCategory = useSelector((state) => state.posts.currentCategory);
  const screenSize = useSelector((state) => state.ui.screenSize);
  const navbarRef = useRef(null);
  const linkRefs = useRef([]);
  const isMediumScreen = screenSize === "xs" || screenSize === "s" || screenSize === "m";
  const { pathname } = useLocation();

  useEffect(() => {
    const handleExpanded = () => {
      linkRefs.current.forEach((link, index) => {
        setTimeout(() => {
          (isExpanded && link?.classList.add("is-visible")) ||
          ((!isMediumScreen || !isExpanded) && link?.classList.remove("is-visible"))
        }, 100 * index);
      });
    };
    handleExpanded();
  }, [isExpanded, screenSize]);

  if (matchPath("/posts/new", pathname)) {
    currentCategory = "new post";
  } else if (matchPath("/posts/:postId/edit", pathname)) {
    currentCategory = "edit";
  }

  const navbarClass = `nav-main__menu ${isMediumScreen ? "nav-main__menu--dropdown" : ""} ${isExpanded && isMediumScreen ? "is-active" : ""}`

  const navElements = () =>
    CATEGORIES.map((category, i) => {
      const isCurrentCategory = currentCategory === category;

      if ((isMediumScreen && !isCurrentCategory) || !isMediumScreen) {
        return (
          <li
            key={i}
            ref={(el) => (linkRefs.current[i] = el)}
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

export default NavMenu;
