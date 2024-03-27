import { Link } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";

export default function ErrorPage() {
  const error = useSelector(state => state.auth.error)

  return (
    <div className="container-errorPage">
      <div>
        <h1 className="error-header">An error occured.</h1>
        <p className="error-message">404 Page Not Found</p>
      </div>
      <Link className="btn btn--basic txt-black sm" to="/">
        Home
      </Link>
    </div>
  );
}
