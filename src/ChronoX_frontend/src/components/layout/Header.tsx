import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common';
import './Header.scss';

const Header: React.FC = () => {
  const { isAuthenticated, login, logout, loading, principal } = useAuth();

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          <div className="header__logo-icon">⏰</div>
          <span className="header__logo-text">ChronoX</span>
        </Link>
        
        <nav className="header__nav">
          <Link to="/events" className="header__nav-link">
            Events
          </Link>
          {isAuthenticated && (
            <Link to="/create" className="header__nav-link">
              Create Event
            </Link>
          )}
        </nav>
        
        <div className="header__auth">
          {isAuthenticated ? (
            <div className="header__user">
              <span className="header__user-id">
                {principal?.slice(0, 8)}...
              </span>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={logout}
                loading={loading}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Button 
              variant="primary" 
              size="sm" 
              onClick={login}
              loading={loading}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;