import React from "react";
import "./Sidebar.css";
import {
  FaUser,
  FaUtensils,
  FaStore,
  FaSignOutAlt,
  FaTachometerAlt,
} from "react-icons/fa";

const Sidebar = ({ onLogout, activeSection, setActiveSection, menuItems }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">Hataima Admin</div>
      <ul className="sidebar-nav">
        {menuItems
          ? menuItems.map((item) => (
              <li
                key={item.key}
                className={activeSection === item.key ? "active" : ""}
                onClick={() => setActiveSection(item.key)}
              >
                {item.label}
              </li>
            ))
          : (
            <>
              <li
                className={activeSection === "dashboard" ? "active" : ""}
                onClick={() => setActiveSection("dashboard")}
              >
                <FaTachometerAlt /> Dashboard
              </li>
              <li
                className={activeSection === "restaurant" ? "active" : ""}
                onClick={() => setActiveSection("restaurant")}
              >
                <FaStore /> Add Restaurant
              </li>
              <li
                className={activeSection === "user" ? "active" : ""}
                onClick={() => setActiveSection("user")}
              >
                <FaUser /> Add User
              </li>
            </>
          )}
      </ul>
      <div className="sidebar-logout" onClick={onLogout}>
        <FaSignOutAlt /> Logout
      </div>
    </div>
  );
};

export default Sidebar;
