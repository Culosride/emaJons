import React, { forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth";
import useLogout from '../../hooks/useLogout';
import useScreenSize from '../../hooks/useScreenSize';
import { Link } from "react-router-dom";
import Button from "../UI/Button";
import { setModal } from "../../features/UI/uiSlice";
import styles from "./AdminMenu.module"

const AdminMenu = forwardRef(( { isPostPage, headerSize, menuOff, setIsExpanded }, ref) => {
  const dispatch = useDispatch();
  const currentPostId = useSelector((state) => state.posts.currentPost._id);
  const handleLogout = useLogout()
  const isMediumScreen = useScreenSize(["xs", "s", "m"])
  const authorization = useAuth();
  const isAdmin = authorization.isAdmin;

  const hasMenuBtn = (headerSize).includes("30") || isMediumScreen

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

  const renderAdminContent = () => {
    if (isPostPage) {
      return (
        <>
          <Button hasIcon={true} type="button" className="delete" onClick={handleDelete} />
          <Link onClick={menuOff} className={styles["nav-link--edit"]} to={`/posts/${currentPostId}/edit`}>
            <span className="icon icon--edit"></span>
          </Link>
        </>
      );
    }
    return (
      <>
        <Link onClick={menuOff} className="nav-main__link" to={"/posts/new"}>
          <span className="icon icon--new-post"></span>
        </Link>
        <Button hasIcon={true} className="logout" title="Logout" onClick={handleLogout} />
      </>
    );
  };

  const renderLoggedOutContent = () => (
    <Link to={"/login"} className="nav-main__link" title="Login">
      <span className="icon icon--login"></span>
    </Link>
  );

  return (
    <>
      {hasMenuBtn && <Button hasIcon={true} type="button" className="kebab" onClick={toggleAdminMenu} />}
      <menu ref={ref} className="admin-menu">
        {isAdmin ? renderAdminContent() : renderLoggedOutContent()}
      </menu>
    </>
  );
})

export default AdminMenu;
