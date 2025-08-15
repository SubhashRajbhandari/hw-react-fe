import React from "react";
import Cookies from "js-cookie";
import "./Header.css";

const Header = ({ onLogout, userType }) => {
  const handleLogout = () => {
    // Clear all cookies
    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.remove(cookieName);
    });
    onLogout();
    // Redirect to login page
    // window.location.href = "/loginPage";
  };

  return (
    <header className="app-header">
      <div className="header-title">nana.s Tea</div>
      <div className="header-actions">
        <button className="notification-btn" title="Notifications">
          <span role="img" aria-label="notifications">
            🔔
          </span>
        </button>
        <span className="user-type">{userType}</span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
