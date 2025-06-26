import React, { useEffect, useState } from 'react';

const MenuPage = () => {
    const [menu, setMenu] = useState(null);

    useEffect(() => {
        // Replace with your actual API Gateway endpoint for the menu
        fetch('https://dummy.restapiexample.com/api/v1/employees')
            .then(response => response.json())
            .then(data => setMenu(data.data))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div>
            <h2>Menu</h2>
            {menu ? (
                <ul>
                    {menu.map(item => (
                        <li key={item.id}>{item.employee_name}</li>
                    ))}
                </ul>
            ) : (
                <p>Loading menu...</p>
            )}
        </div>
    );
};

export default MenuPage;
