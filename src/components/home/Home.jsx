import React from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../../config/categories";
import styles from "./Home.module"

const Home = () => {
  const navLinks = CATEGORIES.concat(["About", "Contact"]);

  const navElements = navLinks.map((category, i) => {
    return (
      <li key={i} className={styles.listItem}>
        <Link className={`${styles["nav-main__link"]} ${styles["nav-main__link--large"]}`} to={`${category}`}>
          {_.capitalize(category)}
        </Link>
      </li>
    );
  });

  return (
    <div className={styles.home}>
      <nav className={styles["nav-main"]}>

        <Link className={`${styles["nav-main__logo"]} ${styles["nav-main__logo--huge"]}`} to={"/about"}>EmaJons</Link>

        <menu className={styles["nav-main__menu"]}>
          {navElements}
        </menu>

      </nav>
    </div>
  );
};

export default Home;
