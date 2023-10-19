import React from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../../config/categories";

const Home = () => {
  const bgImgURL = "/images/IMG_1756.jpg"
  const categories = CATEGORIES.concat(["About", "Contact"]);

  const navElements = categories.map((category, i) => {
    return (
      <li key={i}>
        <Link to={`${category}`}>
          <div className="italic">{_.capitalize(category)}</div>
        </Link>
      </li>
    );
  });

  return (
    <div className="home" style={{ backgroundImage: `url(${bgImgURL})` }}>
      <div className="logo">
        <Link to={"/about"}>EmaJons</Link>
      </div>
      <ul>
        {navElements}
        {/* <li>
          <a
            target="_blank"
            href="https://drive.google.com/file/d/1KBPbeJ0qBVJwroJOFP5IcpmB2yLfuPuu/view?usp=share_link"
            download="portfolio.pdf"
          >
            Portfolio
          </a>
        </li> */}
      </ul>
    </div>
  );
};

export default Home;
