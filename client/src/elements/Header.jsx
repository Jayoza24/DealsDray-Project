import style from "../styles/HeaderStyle.module.css";
import { useNavigate } from "react-router-dom";

const Header = (props) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };
  return (
    <div className={style.mainHeader}>
      <img src="/Logo.png" alt="logo" width="50px" />
      <a href="/">Home</a>
      <a href="/employees">Employee List</a>
      <a>{props.user}</a>
      <a onClick={logout}>Logout</a>
    </div>
  );
};

export default Header;
