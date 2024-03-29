import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, matchPath, useNavigate, useParams, useLoaderData } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deletePost, fetchPosts, setCurrentCategory, setPosts, } from "../../features/posts/postsSlice";
import { fetchTags, selectTag, setTags } from "../../features/tags/tagsSlice";
import { setModal, setScrollPosition } from "../../features/UI/uiSlice";
import NavMenu from "../navigation/NavMenu";
import Modal from "../UI/Modal";
import AdminMenu from "../navigation/AdminMenu.jsx";
import useLogout from '../../hooks/useLogout';
import { useScroll } from "../../hooks/useScroll";
import useScreenSize from "../../hooks/useScreenSize.jsx";
import { CATEGORIES } from "../../config/categories.js";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { postId } = useParams()
  const { category } = useParams()

  const { posts, availableTags, categoryTags } = useLoaderData()

  let currentCategoryValidated = CATEGORIES.find(cat => cat === category)

  useEffect(() => {
    dispatch(setPosts(posts))
    dispatch(setTags({ availableTags, categoryTags }))
  }, [])

  useEffect(() => {
    dispatch(setCurrentCategory(category));
  }, [category])

  const isFullscreen = useSelector((state) => state.ui.isFullscreen);
  const currentPost = useSelector((state) => state.posts.posts.find(post => post._id === postId));
  const postStatus = useSelector((state) => state.posts.status)
  const hasContent = currentPost?.content?.length > 500;
  const modals = useSelector((state) => state.ui.modals);
  const error = useSelector((state) => state.posts.error);

  const [isNavMenuExpanded, setIsNavMenuExpanded] = useState(false);
  const [isAdminMenuActive, setIsAdminMenuActive] = useState(false);

  const headerRef = useRef(null)

  const handleLogout = useLogout()
  const isMediumScreen = useScreenSize(["xs", "s", "m"])

  const isAdminPath = matchPath("/posts/*", pathname)
  const postExists = !isAdminPath && matchPath("/:categories/:postId", pathname);

  const isPostPage = Boolean(postExists);

  if (matchPath("/posts/new", pathname)) {
    currentCategoryValidated = "new post";
  } else if (matchPath("/login", pathname)) {
    currentCategoryValidated = "login"
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
    setIsNavMenuExpanded(false);
    dispatch(selectTag(""))
    dispatch(setScrollPosition(0));
  };

  const confirmPostDelete = async () => {
    if (postStatus === "loading") return

    await Promise.resolve(dispatch(deletePost(postId)));
    await dispatch(fetchPosts());
    await dispatch(fetchTags());
    dispatch(setModal({ key: "postDelete", state: false }));

    navigate(`/${currentCategoryValidated}`);
  }

  const isHeader30 = isPostPage && !hasContent ? "header--30" : ""
  const isHeader50 = isPostPage && hasContent ? "header--50" : ""
  const isHeader100 = isPostPage ? "" : "header--100"

  const headerClass = `header ${isHeader30 || isHeader50 || isHeader100}`

  const currentCategoryStyle = {
    pointerEvents: category === undefined ? "none" : "unset"
  }

  return (
    !isFullscreen &&
    <header ref={headerRef} className={headerClass}>
      <nav className="nav-main">
        <Link className="nav-main__link txt-black sm" onClick={menuOff} to="/">
          EmaJons
        </Link>
        <span className="nav-main__divider"></span>
        {(isPostPage || isMediumScreen) &&
          <Link className="nav-main__link txt-black sm is-selected" style={currentCategoryStyle} to={`/${currentCategoryValidated}`}>
            {currentCategoryValidated}
          </Link>
        }
        {(!isPostPage || isMediumScreen) &&
          <NavMenu
            isNavMenuExpanded={isNavMenuExpanded}
            setIsNavMenuExpanded={setIsNavMenuExpanded}
            toggleNavMenu={toggleNavMenu}
            handleNewCategory={handleNewCategory}
          />
        }
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
          isLoading={postStatus === "loading"}
          loadingMessage={"Deleting post.."}
        />
      }
    </header>
  );
}
