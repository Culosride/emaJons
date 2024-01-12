import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";


const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleLogout = async (token) => {
    localStorage.removeItem("access-token");
    dispatch(logout(token)).then(() => {
      navigate("/");
    });
  };

  return handleLogout;
};

export default useLogout;
