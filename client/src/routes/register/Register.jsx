import React, { useState } from "react";
import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { newUserSchema, yupValidate } from "../../utils/validator";
import Footer from "../../components/footer/Footer";

const Register = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { values, error } = await yupValidate(newUserSchema, userInfo);
    if (error) return setErrorMessage(error);

    try {
      const res = await apiRequest.post("/auth/register", values);
      navigate("/login");
    } catch (error) {
      console.log(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registerContainer">
      <div className="register">
        <div className="formContainer">
          <form onSubmit={handleSubmit}>
            <h1>Create an Account</h1>
            <input
              name="username"
              type="text"
              placeholder="Username"
              onChange={handleChange}
            />
            <input
              name="email"
              type="text"
              placeholder="Email"
              onChange={handleChange}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
            />
            {errorMessage !== null && <span>{errorMessage}</span>}
            <button disabled={isLoading}>Register</button>
            <Link to="/login">Do you have an account?</Link>
          </form>
        </div>
        <div className="imgContainer">
          <img src="/bg.png" alt="" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
