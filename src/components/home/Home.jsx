import React from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../../config/categories";
import styles from "./Home.module.scss"

const Home = () => {
  const navLinks = CATEGORIES.concat(["About", "Contact"]);

  const navElements = navLinks.map((category, i) => {
    return (
      <li key={i} className="nav-main__item">
        <Link className="nav-main__link nav-main__link--large" to={`${category}`}>
          {_.capitalize(category)}
        </Link>
      </li>
    );
  });

  return (
    <div className="home">
      <nav className={styles[navMain] + styles["nav-main--secondary"]}>

        <Link className="nav-main__logo nav-main__logo--huge" to={"/about"}>EmaJons</Link>

        <menu className="nav-main__menu">
          {navElements}
        </menu>

      </nav>
    </div>
  );
};

export default Home;
