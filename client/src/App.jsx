import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { useNavigate } from "react-router-dom";
import LoginRegister from "../src/pages/LoginRegister";
import DashBord from "../src/pages/DashBord";
import Header from "../src/elements/Header";
import EmployeeList from "../src/pages/EmployeeList";
import EmployeeForm from "./pages/EmployeeForm";

function App() {
  const location = useLocation();

  const [user, setUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = () => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      setUser(parsedUserInfo.username);
    } else {
      navigate("/login");
    }
  };

  const showHeaderFooter = location.pathname !== "/login";

  return (
    <>
      {showHeaderFooter && <Header user={user} />}
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<LoginRegister />} />
        <Route index element={<DashBord />} />
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/employees/:id" element={<EmployeeForm />} />
      </Routes>
    </>
  );
}

export default App;
