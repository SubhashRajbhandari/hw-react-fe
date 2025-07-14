import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./RestaurantPanel.css";
import { apiFetch } from "../utils/api";

const RestaurantPanel = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image_url: "",
    is_available: true,
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("addMenu");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);
    try {
      const response = await apiFetch("/api/menu-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (response && response.success) {
        setSuccess("Menu item added successfully!");
        setForm({
          menu_id: "",
          name: "",
          description: "",
          price: "",
          category: "",
          image_url: "",
          is_available: true,
        });
      } else {
        setError("Failed to add menu item.");
      }
    } catch (err) {
      setError("Error adding menu item.");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    window.location.href = "/";
  };

  return (
    <div>
      <Header onLogout={handleLogout} userType="Restaurant" />
      <div style={{ display: "flex" }}>
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          onLogout={handleLogout}
          menuItems={[
            { key: "addMenu", label: "Add Menu Item" },
            { key: "deleteMenu", label: "Delete Menu Item" },
            { key: "addTable", label: "Add Table" },
            { key: "deleteTable", label: "Delete Table" },
          ]}
        />
        <div className="restaurant-panel" style={{ flex: 1 }}>
          <h2>Restaurant Panel</h2>
          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <div>Submitting...</div>
            </div>
          )}
          {activeSection === "addMenu" && (
            <form className="menu-item-form" onSubmit={handleSubmit}>
            {/* menu_id removed, as it is automatically generated */}
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Item Name"
                required
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
              />
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                type="number"
                min="0"
                step="0.01"
                required
              />
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Category"
                required
              />
              <input
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                placeholder="Image URL"
              />
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  name="is_available"
                  type="checkbox"
                  checked={form.is_available}
                  onChange={handleChange}
                />
                Available
              </label>
              <button type="submit">Add Menu Item</button>
            </form>
          )}
          {activeSection === "deleteMenu" && (
            <div>
              <h3>Delete Menu Item</h3>
              {/* TODO: Implement delete menu item functionality */}
              <p>Feature coming soon.</p>
            </div>
          )}
          {activeSection === "addTable" && (
            <div>
              <h3>Add Table</h3>
              {/* TODO: Implement add table functionality */}
              <p>Feature coming soon.</p>
            </div>
          )}
          {activeSection === "deleteTable" && (
            <div>
              <h3>Delete Table</h3>
              {/* TODO: Implement delete table functionality */}
              <p>Feature coming soon.</p>
            </div>
          )}
          {success && <div className="success-message">{success}</div>}
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default RestaurantPanel;
