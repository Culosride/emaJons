import React, { useEffect } from "react";
import { Routes, Route, Navigate, redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "./components/layout/Layout";
import Login from "./components/login/Login";
import AllPosts from "./components/allPosts/AllPosts";
import PostForm from "./components/postForm/PostForm";
import Post from "./components/post/Post";
import About from "./components/about/About";
import Contact from "./components/contact/Contact";
import Home from "./components/home/Home";
import NotFound from "./components/404/NotFound";
import withRouteValidation from "./hocs/RouteValidation";
import RequireAuth from "./hocs/RequireAuth";
import { setScreenSize } from "./features/UI/uiSlice";
import { ROLES } from "./config/roles";
import { setIsLogged } from "./features/auth/authSlice";

const AllPostsRouteValidated = withRouteValidation(AllPosts);
const PostRouteValidated = withRouteValidation(Post);

export default function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.auth.isLogged)

  useEffect(() => {
    const token = localStorage.getItem("access-token")
    if(token) dispatch(setIsLogged(true))
  }, [])

  useEffect(() => {
    const breakpoints = [
      { size: "xs", minWidth: 0, maxWidth: 599 },
      { size: "s", minWidth: 600, maxWidth: 767 },
      { size: "m", minWidth: 767, maxWidth: 991 },
      { size: "l", minWidth: 992, maxWidth: 1199 },
      { size: "xl", minWidth: 1200, maxWidth: 9999 },
    ];

    let previousSize = null;

    const handleResize = () => {
      const currentSize = breakpoints.find(
        (breakpoint) =>
          window.innerWidth >= breakpoint.minWidth &&
          window.innerWidth <= breakpoint.maxWidth
      );

      if (currentSize && currentSize.size !== previousSize) {
        dispatch(setScreenSize(currentSize.size));
        previousSize = currentSize.size;
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
      <Routes>
        {/* public */}
        <Route index path="/" element={<Home />} />
        <Route path="/" element={<Layout />}>
          <Route path="/login" element={isLoggedIn ? <Navigate to="/"/> : <Login />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/:category" element={<AllPostsRouteValidated />} />
          {<Route path="/:category/:postId" element={<PostRouteValidated />} />}
          {/* protected */}
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]}/>}>
            <Route path="/posts/new" element={<PostForm />} />
            <Route path="/posts/:postId/edit" element={<PostForm />} />
          </Route>
          {/*end protected */}
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
  );
}
