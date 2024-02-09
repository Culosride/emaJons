import { Link, useRouteError } from "react-router-dom";
import React from "react";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="container-errorPage">
      <h1 className="error">An error occured.</h1>
      <p className="error"></p>
      <Link className="btn btn--basic txt-black sm" to="/">
        Home
      </Link>
    </div>
  );
}
