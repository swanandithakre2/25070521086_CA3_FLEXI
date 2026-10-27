import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onOpenAddModal }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="brand-mark" aria-hidden="true">ET</span>
          <span>Expense Tracker</span>
        </Link>

        <div className="nav-menu">
          {user ? (
            <>
              <span className="nav-user">
                {user.name}
              </span>
              {onOpenAddModal && (
                <button className="btn btn-primary btn-nav" onClick={onOpenAddModal}>
                  Add Expense
                </button>
              )}
              <button className="btn-logout" onClick={handleLogout}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-nav btn-nav-outline">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-nav">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
