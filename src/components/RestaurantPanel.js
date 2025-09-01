import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./RestaurantPanel.css";
import { apiFetch } from "../utils/api";
import { FaEdit, FaCheck, FaTimes, FaTrash } from "react-icons/fa";

const RestaurantPanel = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image_url: "",
    is_available: true,
  });
  const [menuItems, setMenuItems] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("viewMenu");
  const [editingItem, setEditingItem] = useState(null);
  const isFetchingRef = useRef(false);

  // reset form when switching away from addMenu to cancel edit process
  React.useEffect(() => {
    if (activeSection !== "addMenu") {
      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        image_url: "",
        is_available: true,
      });
      // clear any editing item so card view is shown when returning to viewMenu
      setEditingItem(null);
      setSuccess("");
      setError("");
      setLoading(false);
    }
  }, [activeSection]);

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
      const response = await apiFetch("/api/addMenu-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, user_id: Cookies.get("user_id") }),
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
        // Refresh the menu items after adding a new one
        fetchMenuItems();
      } else {
        setError(response.error || "Failed to add menu item.");
      }
    } catch (err) {
      setError("Error adding menu item.");
    }
    setLoading(false);
  };

  const fetchMenuItems = async () => {
    // prevent overlapping fetches caused by rerenders or accidental re-entry
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);
    try {
      const response = await apiFetch(
        `/api/menu-items?user_id=${Cookies.get("user_id")}`
      );
      if (response && response.success) {
        // normalize menu items to include menu_id (some backends return menu_id)
        setMenuItems(response.menu_items || []);
      } else {
        setError("Failed to fetch menu items.");
      }
    } catch (err) {
      setError("Error fetching menu items.");
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    if (activeSection === "viewMenu") {
      fetchMenuItems();
    }
  }, [activeSection]);

  const handleEditClick = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image_url: item.image_url,
      is_available: item.is_available,
    });
    setActiveSection("addMenu");
  };

  const handleUpdate = async (e, item) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);
    try {
      // If called from the inline save button we receive `item`,
      // otherwise fallback to `editingItem` (when submitting the edit form).
      const target = item || editingItem;
      if (!target) {
        setError("No menu item selected for update.");
        setLoading(false);
        return;
      }
      const payload = {
        ...form,
        user_id: Cookies.get("user_id"),
        // backend expects `menu_item_id` — our list items use `menu_id`
        menu_item_id: target.menu_item_id || target.menu_id,
      };
      const response = await apiFetch(`/api/menu-item/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response && response.success) {
        setSuccess("Menu item updated successfully!");
        setForm({
          name: "",
          description: "",
          price: "",
          category: "",
          image_url: "",
          is_available: true,
        });
        setEditingItem(null);
        fetchMenuItems();
      } else {
        setError(response.error || "Failed to update menu item.");
      }
    } catch (err) {
      setError("Error updating menu item.");
    }
    setLoading(false);
  };

  const handleDelete = async (item) => {
    if (
      !window.confirm(`Delete menu item "${item.name}"? This cannot be undone.`)
    )
      return;
    setSuccess("");
    setError("");
    setLoading(true);
    try {
      const payload = {
        user_id: Cookies.get("user_id"),
        menu_item_id: item.menu_item_id || item.menu_id,
      };
      const response = await apiFetch(`/api/menu-item/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response && response.success) {
        setSuccess("Menu item deleted successfully!");
        // clear any editing state for this item
        if (
          editingItem &&
          (editingItem.menu_item_id === item.menu_item_id ||
            editingItem.menu_id === item.menu_id)
        )
          setEditingItem(null);
        fetchMenuItems();
      } else {
        setError(response.error || "Failed to delete menu item.");
      }
    } catch (err) {
      setError("Error deleting menu item.");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    window.location.href = "/";
  };

  return (
    <div>
      <Header onLogout={handleLogout} userType="Restaurant" />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Restaurant Panel</h2>
        <div style={{ marginRight: "20px", fontWeight: "bold" }}>
          hatai ma waiter
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          onLogout={handleLogout}
          menuItems={[
            { key: "viewMenu", label: "View Menu" },
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
          {activeSection === "viewMenu" && (
            <div className="menu-items-grid">
              {menuItems.length === 0 ? (
                <p>No menu items found.</p>
              ) : (
                menuItems.map((item) => (
                  <div key={item.menu_id} className="menu-item-card">
                    {editingItem?.menu_id === item.menu_id ? (
                      <>
                        <div className="edit-actions">
                          <button
                            className="icon-button save"
                            onClick={(e) => handleUpdate(e, item)}
                          >
                            <FaCheck />
                          </button>
                          <button
                            className="icon-button cancel"
                            onClick={() => setEditingItem(null)}
                          >
                            <FaTimes />
                          </button>
                        </div>
                        <input
                          className="edit-input title"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Item Name"
                        />
                        <textarea
                          className="edit-input description"
                          name="description"
                          value={form.description}
                          onChange={handleChange}
                          placeholder="Description"
                        />
                        <input
                          className="edit-input"
                          name="price"
                          value={form.price}
                          onChange={handleChange}
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Price"
                        />
                        <input
                          className="edit-input"
                          name="category"
                          value={form.category}
                          onChange={handleChange}
                          placeholder="Category"
                        />
                        <input
                          className="edit-input"
                          name="image_url"
                          value={form.image_url}
                          onChange={handleChange}
                          placeholder="Image URL"
                        />
                        <label className="availability-toggle">
                          <input
                            name="is_available"
                            type="checkbox"
                            checked={form.is_available}
                            onChange={handleChange}
                          />
                          Available
                        </label>
                      </>
                    ) : (
                      <>
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="menu-item-image"
                          />
                        )}
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <p className="price">₹{item.price}</p>
                        <p className="category">{item.category}</p>
                        <p
                          className={`status ${
                            item.is_available ? "available" : "unavailable"
                          }`}
                        >
                          {item.is_available ? "Available" : "Not Available"}
                        </p>
                        <div className="card-controls">
                          <button
                            className="icon-button edit"
                            onClick={() => handleEditClick(item)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="icon-button cancel"
                            onClick={() => handleDelete(item)}
                            title="Delete item"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
          {activeSection === "addMenu" && (
            <form
              className="menu-item-form"
              onSubmit={editingItem ? handleUpdate : handleSubmit}
            >
              <h3>{editingItem ? "Edit Menu Item" : "Add New Menu Item"}</h3>
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
              <button type="submit">
                {editingItem ? "Save" : "Add Menu Item"}
              </button>
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
