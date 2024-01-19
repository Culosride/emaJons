import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, matchPath, useNavigate } from "react-router-dom";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { deletePost, setCurrentCategory, fetchPosts, } from "../../features/posts/postsSlice";
import { selectTag } from "../../features/tags/tagsSlice";
import { setModal, setScrollPosition } from "../../features/UI/uiSlice";
import NavMenu from "../navigation/NavMenu";
import Modal from "../UI/Modal";
import AdminMenu from "../adminMenu/AdminMenu.jsx";
import useLogout from '../../hooks/useLogout';
import { useScroll } from "../../hooks/useScroll";
import useScreenSize from "../../hooks/useScreenSize.jsx";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  let currentCategory = useSelector((state) => state.posts.currentCategory);
  const isFullscreen = useSelector((state) => state.ui.isFullscreen);
  const currentPostId = useSelector((state) => state.posts.currentPost._id);
  const hasContent = useSelector((state) => state.posts.currentPost.content?.length > 500);
  const modals = useSelector(state => state.ui.modals);
  const error = useSelector((state) => state.posts.error);
  const activeTag = useSelector(state => state.tags.activeTag)
  const [isNavMenuExpanded, setIsNavMenuExpanded] = useState(false);
  const [isAdminMenuActive, setIsAdminMenuActive] = useState(false);

  const headerRef = useRef(null)

  const handleLogout = useLogout()
  const isMediumScreen = useScreenSize(["xs", "s", "m"])

  const isAdminPath = matchPath("/posts/*", pathname)
  const postExists = !isAdminPath && matchPath("/:categories/:postId", pathname);
  const isPostPage = Boolean(postExists);

  if (matchPath("/posts/new", pathname)) {
    currentCategory = "new post";
  } else if (matchPath("/posts/:postId/edit", pathname)) {
    currentCategory = "edit";
  }

  useEffect(() => {
    if (error.includes("401")) {
      handleLogout();
    }
  }, [error, handleLogout]);


  useEffect(() => {
    setIsNavMenuExpanded(false);
    setIsAdminMenuActive(false);
  }, [pathname, isMediumScreen]);

  const menuOff = () => {
    setIsNavMenuExpanded(false);
    setIsAdminMenuActive(false);
  };

  const toggleNavMenu = () => {
    setIsNavMenuExpanded(!isNavMenuExpanded)
    setIsAdminMenuActive(false);
  };

  useScroll(headerRef, menuOff, { threshold: 40, scrollClass: "fade-top" })

  const handleNewCategory = () => {
    if(activeTag) dispatch(selectTag(""));
    setIsNavMenuExpanded(false);
    dispatch(setScrollPosition(0));
  };

  const confirmPostDelete = () => {
    dispatch(deletePost([currentPostId, currentCategory])).then(
      () => dispatch(fetchPosts()) && navigate(`/${currentCategory}`)
    );
    dispatch(setModal({ key: "postDelete", state: false }))
  }

  const isHeader30 = isPostPage && !hasContent ? "header--30" : ""
  const isHeader50 = isPostPage && hasContent ? "header--50" : ""
  const isHeader100 = isPostPage ? "" : "header--100"

  const headerClass = `header ${isHeader30 || isHeader50 || isHeader100}`

  return (
    !isFullscreen &&
    <header ref={headerRef} className={headerClass}>
      <nav className="nav-main">
        <Link className="nav-main__link txt-black sm" onClick={menuOff} to="/">
          EmaJons
        </Link>
        <span className="nav-main__divider"></span>
        {(isPostPage || isMediumScreen) &&
          <Link className="nav-main__link txt-black sm is-selected">
            {currentCategory}
          </Link>}
        {!isPostPage &&
          <NavMenu
            isNavMenuExpanded={isNavMenuExpanded}
            setIsNavMenuExpanded={setIsNavMenuExpanded}
            toggleNavMenu={toggleNavMenu}
            handleNewCategory={handleNewCategory}
          />}
      </nav>
      <AdminMenu
        headerSize={headerClass}
        isAdminMenuActive={isAdminMenuActive}
        setIsNavMenuExpanded={setIsNavMenuExpanded}
        setIsAdminMenuActive={setIsAdminMenuActive}
        isPostPage={isPostPage}
        menuOff={menuOff}
      />
      {modals.postDelete &&
        <Modal
          modalKey="postDelete"
          description="Delete this post?"
          confirmDelete={confirmPostDelete}
        />}
    </header>
  );
}
