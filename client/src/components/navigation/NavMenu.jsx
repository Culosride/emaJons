import React, { useEffect, useRef } from "react";
import { CATEGORIES } from "../../config/categories.js";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../UI/Button.jsx";
import useScreenSize from "../../hooks/useScreenSize.jsx";
import _ from 'lodash';

const NavMenu = ({ handleNewCategory, toggleNavMenu, isNavMenuExpanded }) => {
  let currentCategory = useSelector((state) => state.posts.currentCategory);
  const linkRefs = useRef([]);
  const isMediumScreen = useScreenSize(["xs", "s", "m"]);

  useEffect(() => {
    const handleExpanded = () => {
      linkRefs.current.forEach((link, index) => {
        setTimeout(() => {
          (isNavMenuExpanded && link?.classList.add("is-visible")) ||
            ((!isMediumScreen || !isNavMenuExpanded) &&
              link?.classList.remove("is-visible"));
        }, 100 * index);
      });
    };
    handleExpanded();
  }, [isNavMenuExpanded, isMediumScreen]);

  const isDropdown = isMediumScreen ? "nav-main__menu--dropdown" : "";
  const isDropDownActive = isNavMenuExpanded && isMediumScreen ? "is-active" : "";
  const navbarClass = `nav-main__menu ${isDropdown} ${isDropDownActive}`.trim();
  const btnClass = `dropdown ${isNavMenuExpanded ? "is-active" : ""}`.trim();

  const navElements = () =>
    CATEGORIES.map((category, i) => {
      const isCurrentCategory = currentCategory === category;

      const categoryItemClass = `nav-main__item ${isMediumScreen ? "nav-main__item--dropdown" : ""}`;
      const categoryLinkClass = `nav-main__link nav-main__link txt-grey sm ${isCurrentCategory ? "is-selected" : ""}`.trim();

      if ((isMediumScreen && !isCurrentCategory) || !isMediumScreen) {
        return (
          <li
            key={i}
            ref={(el) => (linkRefs.current[i] = el)}
            className={categoryItemClass}
          >
            <Link
              onClick={handleNewCategory}
              className={categoryLinkClass}
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
      {isMediumScreen && (
        <Button hasIcon={true} className={btnClass} onClick={toggleNavMenu} />
      )}
      <menu className={navbarClass}>{navElements()}</menu>
    </>
  );
};

export default NavMenu;
