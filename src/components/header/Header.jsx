import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, matchPath, useNavigate } from "react-router-dom";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { deletePost, setCurrentCategory, fetchPosts, } from "../../features/posts/postsSlice";
import { selectTag } from "../../features/tags/tagsSlice";
import { setModal, setScrollPosition } from "../../features/UI/uiSlice";
import { logout } from "../../features/auth/authSlice";
import NavMenu from "../navigation/NavMenu";
import { useScroll } from "../../hooks/useScroll";
import Modal from "../UI/Modal";
import AdminMenu from "../adminMenu/AdminMenu.jsx";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  let currentCategory = useSelector((state) => state.posts.currentCategory);
  const isFullscreen = useSelector((state) => state.ui.isFullscreen);
  const currentPostId = useSelector((state) => state.posts.currentPost._id);
  const hasContent = useSelector((state) => state.posts.currentPost.content?.length > 500);
  const modals = useSelector(state => state.ui.modals);
  const postsStatus = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);
  const screenSize = useSelector((state) => state.ui.screenSize);

  // const isSmallScreen = ["xs", "s"].includes(screenSize);
  const isMediumScreen = ["xs", "s", "m"].includes(screenSize);

  const [isExpanded, setIsExpanded] = useState(false);

  const logoAndCategoryRef = useRef(null);
  const adminMenuRef = useRef(null)
  const headerRef = useRef(null)

  useEffect(() => {
    if (error.includes("401")) handleLogout();
  }, [postsStatus]);

  useEffect(() => {
    setIsExpanded(false);
    adminMenuRef.current?.classList.remove("is-active")
  }, [pathname, screenSize]);

  const menuOff = () => {
    setIsExpanded(false);
    adminMenuRef.current?.classList.remove("is-active")
  };

  useScroll(headerRef, menuOff, { threshold: 40, scrollClass: "fade-top" })

  // to rename ?
  const admin = matchPath("/posts/*", pathname);
  const postPage = admin ? false : matchPath("/:categories/:postId", pathname);
  const isPostPage = Boolean(postPage)

  if (matchPath("/posts/new", pathname)) {
    currentCategory = "new post";
  } else if (matchPath("/posts/:postId/edit", pathname)) {
    currentCategory = "edit";
  }

  async function handleLogout() {
    localStorage.removeItem("access-token");
    dispatch(logout(token)).then(() => {
      navigate("/");
    });
  }

  const toggleMenu = () => {
    setIsExpanded(!isExpanded)
    adminMenuRef.current?.classList.remove("is-active")
  };

  const handleNewCategory = (category) => {
    setIsExpanded(false);
    dispatch(selectTag(""));
    dispatch(setScrollPosition(0));
    dispatch(setCurrentCategory(category));
  };

  function confirmPostDelete() {
    dispatch(deletePost([currentPostId, currentCategory])).then(
      () => dispatch(fetchPosts()) && navigate(`/${currentCategory}`)
    );
    dispatch(setModal({ key: "postDelete", state: false }))
  }

  const headerClass = `header ${isPostPage ? "" : "header--100"} ${isPostPage && hasContent ? "header--50" : ""} ${(isPostPage && !hasContent) ? "header--30" : ""}`

  return (
    !isFullscreen &&
    <header ref={headerRef} className={headerClass}>
       <nav ref={logoAndCategoryRef} className="nav-main">
      <Link onClick={menuOff} to="/" className="nav-main__logo nav-main__logo--small">
        EmaJons
      </Link>
      <span className="nav-main__divider"></span>
    {(isPostPage || isMediumScreen) && <Link className="nav-main__link nav-main__link--small is-active">{currentCategory}</Link>}
    {!postPage &&
      <NavMenu
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        toggleMenu={toggleMenu}
        adminMenuRef={adminMenuRef}
        handleNewCategory={handleNewCategory}
        />}
    </nav>
      <AdminMenu ref={adminMenuRef} isPostPage={isPostPage} handleLogout={handleLogout} menuOff={menuOff} setIsExpanded={setIsExpanded}/>
      {modals.postDelete && <Modal modalKey="postDelete" description="Delete this post?" confirmDelete={confirmPostDelete} />}
    </header>
  );
}
