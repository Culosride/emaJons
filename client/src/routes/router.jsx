import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Login, { loader as loginLoader } from "../components/login/Login";
import AllPosts, { loader as getPostsLoader } from "../components/allPosts/AllPosts";
import PostForm from "../components/postForm/PostForm";
import Post, { loader as getPostLoader } from "../components/post/Post";
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
    errorElement: <ErrorPage />,
    children: [
      { path: "login", element: <Login />, loader: loginLoader},
      { path: "contact", element: <Contact /> },
      { path: "about", element: <About /> },
      { path: ":category", element: <AllPostsRouteValidated />, loader: getPostsLoader, },
      { path: ":category/:postId", element: <PostRouteValidated />, loader: getPostLoader },

      //////////////////////////// PROTECTED ROUTES ////////////////////////////
      { element: <RequireAuth allowedRoles={[ROLES.Admin]} />,
        children: [
          { path: "posts/new", element: <PostForm /> },
          { path: ":category/:postId/edit", element: <EditRouteValidated />, loader: getPostLoader },
        ],
      },
    ],
  },
]);
