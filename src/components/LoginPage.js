import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUtensils, FaUser, FaLock } from "react-icons/fa";
import "./LoginPage.css";
import { apiFetch } from "../utils/api";
import Cookies from "js-cookie";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginAttempt, setLoginAttempt] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const tryLogin = async () => {
      if (!loginAttempt) return;
      if (password !== "khuljasimsim") {
        setError("Invalid password");
        setLoginAttempt(false);
        return;
      }
      setLoading(true);
      try {
        const response = await apiFetch(
          `/api/isEmailRegistered?email=${encodeURIComponent(username)}`
        );
        if (
          response &&
          response.status === 200 &&
          response.is_registered === true &&
          response.success === true
        ) {
          setError("");
          Cookies.set("email", username, { expires: 1 });
          Cookies.set("user_id", response.user_id, { expires: 1 });
          if (response.user_type === "SuperAdmin") {
            navigate("/superadmin");
          } else if (response.user_type === "Restaurant") {
            navigate("/restaurant");
          } else {
            navigate("/dashboard");
          }
        } else {
          setError("User doesn't exist");
        }
      } catch (err) {
        setError("Error checking user registration");
      }
      setLoading(false);
      setLoginAttempt(false);
    };
    tryLogin();
  }, [loginAttempt]);

  const handleLogin = () => {
    setLoginAttempt(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setLoginAttempt(true);
    }
  };

  return (
    <div className="login-container">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <div>Loading...</div>
        </div>
      )}
      <h1 className="restaurant-title">nana.s Tea</h1>
      <div className="login-card">
        <div className="login-logo">
          <FaUtensils />
        </div>
        <h1>Welcome Back</h1>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <div className="input-container">
            <FaUser style={{ margin: "0 0 0 10px", color: "#6c757d" }} />
            <input
              id="username"
              className="form-input"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-container">
            <FaLock style={{ margin: "0 0 0 10px", color: "#6c757d" }} />
            <input
              id="password"
              className="form-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>
        <p className="login-hint">
          (Hint: Use your email & password: khuljasimsim)
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
