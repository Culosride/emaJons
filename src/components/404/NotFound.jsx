import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container-404">
      <h1 className="error">404 not found</h1>
      <Link className="btn btn--basic txt-black sm" to="/">
        Home
      </Link>
    </div>
  );
}

export default NotFound;
