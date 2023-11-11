import React from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../../config/categories";

const Home = () => {
  const navLinks = CATEGORIES.concat(["About", "Contact"]);

  const navElements = navLinks.map((category, i) => {
    return (
      <li key={i} className="nav__item">
        <Link className="nav__link nav__link--large" to={`${category}`}>
          {_.capitalize(category)}
        </Link>
      </li>
    );
  });

  return (
    <div className="home">
      <nav className="nav-main nav-main--secondary">

        <Link className="nav__logo nav__logo--huge" to={"/about"}>EmaJons</Link>

        <menu className="nav__menu">
          {navElements}
        </menu>

      </nav>
    </div>
  );
};

export default Home;
