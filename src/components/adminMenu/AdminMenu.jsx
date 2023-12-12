import React, { forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import Button from "../UI/Button";
import { logout } from "../../features/auth/authSlice";
import { setModal } from "../../features/UI/uiSlice";
import styles from "./AdminMenu.module"
import { selectTag } from "../../features/tags/tagsSlice";


const AdminMenu = forwardRef(( { isPostPage, menuOff, setIsExpanded }, ref) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authorization = useAuth();
  const isAdmin = authorization.isAdmin;
  const token = localStorage.getItem("access-token");
  const currentPostId = useSelector((state) => state.posts.currentPost._id);

  let content;

  const toggleAdminMenu = () => {
    if (ref.current?.className.includes("is-active")) {
      ref.current?.classList.remove("is-active");
    } else {
      ref.current?.classList.add("is-active");
      setIsExpanded(false);
    }
  };

  const handleDelete = () => {
    dispatch(setModal({ key: "postDelete", state: true }));
  }

   const handleLogout = async () => {
    localStorage.removeItem("access-token");
    dispatch(selectTag(""))
    dispatch(logout(token)).then(() => {
      navigate("/");
    });
  }

  if (isAdmin) {
    if (isPostPage) {
      // if logged in and on post page -> posts/:postId
      content = (
        <>
          <Button type="button" className="btn--delete" onClick={handleDelete}>
            <span className="icon icon--delete"></span>
          </Button>
          <Link onClick={menuOff} className={styles["nav-link--edit"]} to={`/posts/${currentPostId}/edit`}>
            <span className="icon icon--edit"></span>
          </Link>
        </>
      );
    } else {
      content = (
        <>
          <Link onClick={menuOff} className="nav-main__link" to={"/posts/new"}>
            <span className="icon icon--new-post"></span>
          </Link>
          <Button className="btn--logout" title="Logout" onClick={handleLogout}>
            <span className="icon icon--logout"></span>
          </Button>
        </>
      );
    }
  } else {
    // if logged out
    content = (
      <Link to={"/login"} className="nav-main__link" title="Login">
        <span className="icon icon--login"></span>
      </Link>
    );
  }

  return (
    <>
      <Button type="button" className="btn--kebab medium" onClick={toggleAdminMenu}>
        <span className="icon icon--kebab"></span>
      </Button>
      <menu ref={ref} className="admin-menu">
        {content}
      </menu>
    </>
  );
})

export default AdminMenu;
