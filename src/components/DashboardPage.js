import React, { useState, useEffect, useRef } from 'react';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBell, FaConciergeBell, FaUtensils, FaChevronRight } from 'react-icons/fa';
import './DashboardPage.css';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserPopover, setShowUserPopover] = useState(false);
    const notificationRef = useRef(null);
    const userPopoverRef = useRef(null);

    const handleCallWaiter = () => {
        // Replace with your actual API Gateway endpoint
        fetch('https://dummy.restapiexample.com/api/v1/create', { method: 'POST' })
            .then(response => response.json())
            .then(data => alert('Waiter called!'))
            .catch(error => console.error('Error:', error));
    };

    const handleViewMenu = () => {
        navigate('/menu');
    };

    const handleLogout = () => {
        navigate('/');
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        if (!showNotifications) {
            setShowUserPopover(false);
        }
    };

    const toggleUserPopover = () => {
        setShowUserPopover(!showUserPopover);
        if (!showUserPopover) {
            setShowNotifications(false);
        }
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target) &&
                userPopoverRef.current && !userPopoverRef.current.contains(event.target)) {
                setShowNotifications(false);
                setShowUserPopover(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const notifications = [
        { id: 1, text: 'Your table is ready.' },
        { id: 2, text: 'New menu item added.' },
    ];

    return (
        <div className="full-page-container">
            <Header onLogout={handleLogout} userType="User" />
            <div className="dashboard-header">
                <h1>Restaurant Portal</h1>
                <div className="header-icons">
                    <div className="notification-container" ref={notificationRef}>
                        <FaBell className="icon" onClick={toggleNotifications} />
                        {showNotifications && (
                            <div className="notification-dropdown">
                                <h3>Notifications</h3>
                                {notifications.length > 0 ? (
                                    <ul>
                                        {notifications.map(n => <li key={n.id}>{n.text}</li>)}
                                    </ul>
                                ) : (
                                    <p>No new notifications</p>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="user-container" ref={userPopoverRef}>
                        <FaUserCircle className="icon" onClick={toggleUserPopover} />
                        {showUserPopover && (
                            <div className="user-popover">
                                <div className="user-info">
                                    <FaUserCircle size={40} />
                                    <span>testuser</span>
                                </div>
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="dashboard-content">
                <h2>Welcome to the Dashboard</h2>
                <div className="dashboard-buttons">
                    <div className="card-button call-waiter-btn" onClick={handleCallWaiter}>
                        <div className="card-icon">
                            <FaConciergeBell />
                        </div>
                        <div className="card-content">
                            <h3>Call Waiter</h3>
                            <p>Request assistance from our staff</p>
                        </div>
                        <div className="card-arrow">
                            <FaChevronRight />
                        </div>
                    </div>
                    <div className="card-button view-menu-btn" onClick={handleViewMenu}>
                        <div className="card-icon">
                            <FaUtensils />
                        </div>
                        <div className="card-content">
                            <h3>View Menu</h3>
                            <p>Browse our delicious offerings</p>
                        </div>
                        <div className="card-arrow">
                            <FaChevronRight />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
