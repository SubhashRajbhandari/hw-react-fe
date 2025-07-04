import React, { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

const MenuPage = () => {
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    apiFetch("/menu")
      .then((data) => setMenu(data.data || data))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div>
      <h2>Menu</h2>
      {menu ? (
        <ul>
          {menu.map((item) => (
            <li key={item.id}>{item.name || item.employee_name}</li>
          ))}
        </ul>
      ) : (
        <p>Loading menu...</p>
      )}
    </div>
  );
};

export default MenuPage;
