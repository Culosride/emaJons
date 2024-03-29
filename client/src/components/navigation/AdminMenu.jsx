import React from "react";
import { useDispatch } from "react-redux";
import useAuth from "../../hooks/useAuth";
import useLogout from '../../hooks/useLogout';
import useScreenSize from '../../hooks/useScreenSize';
import { Link, useParams } from "react-router-dom";
import Button from "../UI/Button";
import { setModal } from "../../features/UI/uiSlice";

const AdminMenu = ({ isAdminMenuActive, setIsAdminMenuActive, setIsNavMenuExpanded, isPostPage, headerSize, menuOff }) => {
  const dispatch = useDispatch();
  const { category, postId } = useParams();
  const handleLogout = useLogout()
  const isMediumScreen = useScreenSize(["xs", "s", "m"])
  const authorization = useAuth();
  const isAdmin = authorization.isAdmin;

  const hasMenuBtn = (headerSize).includes("30") || isMediumScreen

  const toggleAdminMenu = () => {
    setIsNavMenuExpanded(false);
    setIsAdminMenuActive(!isAdminMenuActive)
  };

  const handleDelete = () => {
    dispatch(setModal({ key: "postDelete", state: true }));
  }

  const renderAdminContent = () => {
    if (isPostPage) {
      return (
        <>
          <Button hasIcon={true} className="delete" onClick={handleDelete} />
          <Link onClick={menuOff} className="admin-menu__link" to={`/${category}/${postId}/edit`}>
            <span className="icon icon--edit"></span>
          </Link>
        </>
      );
    }
    return (
      <>
        <Link onClick={menuOff} className="admin-menu__link" to={"/posts/new"}>
          <span className="icon icon--new-post"></span>
        </Link>
        <Button hasIcon={true} className="logout" title="Logout" onClick={handleLogout} />
      </>
    );
  };

  const renderLoggedOutContent = () => (
    <Link to={"/login"} className="admin-menu__link" title="Login">
      <span className="icon icon--login"></span>
    </Link>
  );

  return (
    <>
      {hasMenuBtn && <Button hasIcon={true} className="kebab" onClick={toggleAdminMenu} />}
      <menu className={`admin-menu ${isAdminMenuActive ? 'is-active' : ''}`}>
        {isAdmin ? renderAdminContent() : renderLoggedOutContent()}
      </menu>
    </>
  );
}

export default AdminMenu;
