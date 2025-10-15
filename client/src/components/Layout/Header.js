import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {message} from 'antd';
const Header = () => {
  const [loginUser, setLoginUser] = useState(null);
  const navigate = useNavigate(); // To programmatically navigate after logout

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) setLoginUser(user);
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem('user');
    message.success('Logout Successful');
    setLoginUser(null);
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Expense Management</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {loginUser ? (
              <>
                <li className="nav-item me-3">
                  <span className="nav-link">{loginUser.name}</span>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger"
                    onClick={logoutHandler}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-3">
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
