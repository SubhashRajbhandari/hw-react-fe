import React from "react";
import "./Header.css";

const Header = ({ onLogout, userType }) => (
  <header className="app-header">
    <div className="header-title">nana.s Tea</div>
    <div className="header-actions">
      <button className="notification-btn" title="Notifications">
        <span role="img" aria-label="notifications">
          🔔
        </span>
      </button>
      <span className="user-type">{userType}</span>
      <button className="logout-btn" onClick={onLogout}>
        Logout
      </button>
    </div>
  </header>
);

export default Header;
