import React from "react";
import Cookies from "js-cookie";
import "./Header.css";

const Header = ({ onLogout, userType }) => {
  const handleLogout = () => {
    // If `mp` cookie exists, do nothing besides calling onLogout
    const allCookies = Cookies.get();
    if (allCookies && Object.prototype.hasOwnProperty.call(allCookies, "mp")) {
      onLogout();
      return;
    }

    // Clear all cookies otherwise
    Object.keys(allCookies).forEach((cookieName) => {
      Cookies.remove(cookieName);
    });
    onLogout();
    // Redirect to login page
    window.location.href = "/";
  };

  return (
    <header className="app-header">
      <div className="header-title">Hataima Waiter</div>
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
