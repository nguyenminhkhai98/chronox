import React from 'react';
import Header from './Header';
import './Layout.scss';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main className="layout__main">
        {children}
      </main>
      <footer className="layout__footer">
        <div className="layout__footer-container">
          <p>&copy; 2025 ChronoX. Built on Internet Computer.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;