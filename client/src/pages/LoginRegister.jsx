import { useState } from "react";
import style from "../styles/LoginRegisterStyle.module.css";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [isLogin, setLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLogin) {
      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/users/login",
          { username, password }
        );
        localStorage.setItem("userInfo", JSON.stringify(data));
        navigate("/");
      } catch (error) {
        toast.error(error.response.data.message || "Login failed!");
      }
    } else {
      if (password == cPassword) {
        try {
          const { data } = await axios.post(
            "http://localhost:5000/api/users/register",
            { username, email, password }
          );
          localStorage.setItem("userInfo", JSON.stringify(data));
          navigate("/");
        } catch (error) {
          toast.error(error.response.data.message || "Sign up failed!");
        }
      } else {
        toast.error("Password Doesn't Matcherd!!");
      }
    }
  };

  return (
    <div className={style.loginMain}>
      <div className={style.lrcontainer}>
        <form onSubmit={handleLogin}>
          <label>Login</label>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email id"
            style={{ display: !isLogin ? "" : "none" }}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            style={{ display: !isLogin ? "" : "none" }}
            onChange={(e) => setCPassword(e.target.value)}
            required
          />
          <button onClick={handleLogin}>
            {isLogin ? "Login" : "Register"}
          </button>
          <label
            id={style.dontAcct}
            onClick={() => setLogin(!isLogin)}
          >{!isLogin ? `Already had account ? Login Now` : `Don't have and account ? Register Now`}</label>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
