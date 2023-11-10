import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, matchPath, useNavigate } from "react-router-dom";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePost,
  setCurrentCategory,
  fetchPosts,
} from "../../features/posts/postsSlice";
import { selectTag } from "../../features/tags/tagsSlice";
import { setModal, setScrollPosition } from "../../features/UI/uiSlice";
import useAuth from "../../hooks/useAuth.jsx";
import { logout } from "../../features/auth/authSlice";
import DropdownNav from "../dropdownNavigation/DropdownNav";
import Button from "../UI/Button";
import { useScroll } from "../../hooks/useScroll";
import Modal from "../UI/Modal";

export default function Header() {
  const authorization = useAuth(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isAdmin = authorization.isAdmin;
  const token = localStorage.getItem("access-token");

  let currentCategory = useSelector((state) => state.posts.currentCategory);
  const isFullscreen = useSelector((state) => state.ui.isFullscreen);
  const currentPostId = useSelector((state) => state.posts.currentPost._id);
  const hasContent = useSelector(
    (state) => state.posts.currentPost.content?.length > 500
  );
  const isModal = useSelector(state => state.ui.isModal);
  const postsStatus = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);
  const screenSize = useSelector((state) => state.ui.screenSize);
  const isSmallScreen = screenSize === "xs" || screenSize === "s";

  const [isExpanded, setIsExpanded] = useState(false);

  const logoAndCategoryRef = useRef();
  const adminMenuRef = useRef()
  const headerRef = useRef()

  useEffect(() => {
    if (error.includes("401")) handleLogout();
  }, [postsStatus]);

  useEffect(() => {
    setIsExpanded(false);
    adminMenuRef.current?.classList.remove("active")
  }, [pathname, screenSize]);

  const menuOff = () => {
    setIsExpanded(false);
    adminMenuRef.current?.classList.remove("active")
  };

  useScroll(headerRef, menuOff, { threshold: 40, scrollClass: "fade-top" })

  // to rename ?
  const admin = matchPath("/posts/*", pathname);
  const post = admin ? false : matchPath("/:categories/:postId", pathname);


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

  const handleNewCategory = (category) => {
    setIsExpanded(false);
    dispatch(selectTag(""));
    dispatch(setScrollPosition(0));
    dispatch(setCurrentCategory(category));
  };

  const toggleAdminMenu = () => {
    if(adminMenuRef.current?.className.includes("active")) {
      adminMenuRef.current?.classList.remove("active")
    } else {
      adminMenuRef.current?.classList.add("active")
      setIsExpanded(false)
    }
  };

  const toggleMenu = () => {
    setIsExpanded(!isExpanded)
    adminMenuRef.current?.classList.remove("active")
  };

  const handleLogin = () => {
    setIsExpanded(false);
  };

  function handleDelete() {
    dispatch(setModal(true))
  }

  function confirmPostDelete() {
    dispatch(deletePost([currentPostId, currentCategory])).then(
      () => dispatch(fetchPosts()) && navigate(`/${currentCategory}`)
    );
    dispatch(setModal(false))
  }

  const adminMenu = () => {
    if (isAdmin) {
      return (
        <>
          <Button type="button" className="header__btn--kebabMenu medium" onClick={toggleAdminMenu}>
            <span className="icon icon-kebab"></span>
          </Button>
          <div ref={adminMenuRef} className="admin-menu">
            <Link onClick={menuOff} className="nav-link" to={"/posts/new"}>
              <span className="icon new-post"></span>
            </Link>/
            <Button className="btn" title="Logout" onClick={handleLogout}>
              <span className="icon logout"></span>
            </Button>
          </div>
        </>
      );
    } else {
      return <Link to={"/login"} onClick={handleLogin} className="icon-login" title="Login" />
    }
  };

  const postMenu = () => {
    return (
      <>
        {<Button type="button" className="kebab-menu medium" onClick={toggleAdminMenu}/>}
        <div ref={adminMenuRef} className="admin-menu">
          <Button type="button" className="delete" onClick={handleDelete} />
          <Link onClick={menuOff} className="edit" to={`/posts/${currentPostId}/edit`} />
        </div>
      </>
    );
  };

  return (
    <>
      {(!post && (
        <header ref={headerRef} className="header--100">
          <nav ref={logoAndCategoryRef} className="nav-main">
            <Link onClick={menuOff} to="/" className="nav-main__logo nav-main__logo--small">
              EmaJons
            </Link>
            <span className="nav-main__divider"></span>
            {isSmallScreen && <span className="nav-main__link nav-main__link--small is-active">{currentCategory}</span>}
            <DropdownNav
              isSmallScreen={isSmallScreen}
              isExpanded={isExpanded}
              toggleMenu={toggleMenu}
              handleNewCategory={handleNewCategory}
            />
          </nav>
          {adminMenu()}
        </header>
      )) ||
        (post && !isFullscreen && (
          <header
            ref={headerRef}
            className={`${hasContent ? "header-50" : "header-30 header-50"}`}
          >
            <nav ref={logoAndCategoryRef} className="header__nav">
              <Link onClick={menuOff} to="/" className="nav-main__logo nav-main__logo--small">
                EmaJons
              </Link>
              <span className="nav-main__divider"></span>
              <Link to={`/${currentCategory}`}>{currentCategory}</Link>
            </nav>
            {isModal && <Modal open={isModal}>
              <div>
                <p>Delete this post?</p>
                <div className="modal-actions-container">
                  <Button type="button" className="modal-action" onClick={() => dispatch(setModal(false))}>No</Button>
                  <Button type="button" className="modal-action" onClick={confirmPostDelete}>Yes</Button>
                </div>
              </div>
            </Modal>}
            {isAdmin && postMenu()}
          </header>
        ))}
    </>
  );
}
