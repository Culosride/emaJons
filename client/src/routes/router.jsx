import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { loader as dataLoader } from "../App";
import Login, { loader as loginLoader } from "../components/login/Login";
import AllPosts from "../components/allPosts/AllPosts";
import PostForm from "../components/postForm/PostForm";
import Post, { loader as postLoader } from "../components/post/Post";
import About from "../components/about/About";
import Contact from "../components/contact/Contact";
import Home from "../components/home/Home";
import ErrorPage from "../components/errorPage/ErrorPage";
import withRouteValidation from "../hocs/RouteValidation";
import RequireAuth from "../hocs/RequireAuth";
import { ROLES } from "../config/roles";

const AllPostsRouteValidated = withRouteValidation(AllPosts);
const PostRouteValidated = withRouteValidation(Post);
const EditRouteValidated = withRouteValidation(PostForm);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    index: true,
    errorElement: <ErrorPage />,
  },
  {
    element: <Layout />,
    loader: dataLoader,
    id: "root",
    children: [
      { path: "login", element: <Login />, loader: loginLoader },
      { path: "contact", element: <Contact /> },
      { path: "about", element: <About /> },
      {
        path: ":category",
        element: <AllPostsRouteValidated />,
      },
      {
        path: ":category/:postId",
        element: <PostRouteValidated />,
        loader: postLoader,
      },

      //////////////////////////// PROTECTED ROUTES ////////////////////////////
      {
        element: <RequireAuth allowedRoles={[ROLES.Admin]} />,
        children: [
          { path: "posts/new", element: <PostForm /> },
          {
            path: ":category/:postId/edit",
            element: <EditRouteValidated />,
            loader: postLoader,
          },
        ],
      },
    ],
  },
]);
