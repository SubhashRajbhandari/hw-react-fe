import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaUser, FaLock } from 'react-icons/fa';
import './LoginPage.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        if (username === 'testuser' && password === 'password') {
            setError('');
            navigate('/dashboard');
        } else {
            setError('Invalid username or password');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="login-container">
            <h1 className="restaurant-title">Fine Dining Restaurant</h1>
            <div className="login-card">
                <div className="login-logo">
                    <FaUtensils />
                </div>
                <h1>Welcome Back</h1>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <div className="input-container">
                        <FaUser style={{ margin: '0 0 0 10px', color: '#6c757d' }} />
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
                        <FaLock style={{ margin: '0 0 0 10px', color: '#6c757d' }} />
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
                    (Hint: Use "testuser" / "password")
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
