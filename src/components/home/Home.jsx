import React from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../../config/categories";

const Home = () => {
  const navLinks = CATEGORIES.concat(["About", "Contact"]);

  const navElements = navLinks.map((category, i) => {
    return (
      <li key={i} className="nav-main__item">
        <Link className="nav-main__link lg txt-black" to={`${category}`}>
          {_.capitalize(category)}
        </Link>
      </li>
    );
  });

  return (
    <div className="home">
      <nav className="nav-main">
        <Link className="nav-main__link txt-black xl" to={"/about"}>
          EmaJons
        </Link>

        <menu className="nav-main__menu">{navElements}</menu>
      </nav>
    </div>
  );
};

export default Home;
