import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common';
import './Home.scss';

const Home: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/events');
    } else {
      login();
    }
  };

  return (
    <div className="home">
      <section className="home__hero">
        <div className="container">
          <div className="home__hero-content">
            <div className="home__hero-text">
              <h1 className="home__title">
                Decentralized Event Management
                <span className="home__title-accent"> on the Blockchain</span>
              </h1>
              <p className="home__subtitle">
                Create, manage, and attend events with complete transparency and trust. 
                Built on Internet Computer for ultimate security and decentralization.
              </p>
              <div className="home__actions">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={handleGetStarted}
                >
                  {isAuthenticated ? 'View Events' : 'Get Started'}
                </Button>
                <Link to="/events">
                  <Button variant="secondary" size="lg">
                    Browse Events
                  </Button>
                </Link>
              </div>
            </div>
            <div className="home__hero-visual">
              <div className="home__clock">
                <div className="home__clock-face">
                  <div className="home__clock-hand home__clock-hand--hour"></div>
                  <div className="home__clock-hand home__clock-hand--minute"></div>
                  <div className="home__clock-center"></div>
                  {[...Array(12)].map((_, i) => (
                    <div 
                      key={i} 
                      className="home__clock-marker" 
                      style={{ transform: `rotate(${i * 30}deg)` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home__features">
        <div className="container">
          <h2 className="home__features-title">Why Choose ChronoX?</h2>
          <div className="grid grid--3">
            <div className="home__feature">
              <div className="home__feature-icon">🔒</div>
              <h3>Secure & Transparent</h3>
              <p>
                Built on Internet Computer blockchain with cryptographic security 
                and complete transparency for all event data.
              </p>
            </div>
            <div className="home__feature">
              <div className="home__feature-icon">👥</div>
              <h3>Decentralized Identity</h3>
              <p>
                No passwords or personal data required. Authenticate securely 
                using Internet Identity for complete privacy.
              </p>
            </div>
            <div className="home__feature">
              <div className="home__feature-icon">📅</div>
              <h3>Smart Event Management</h3>
              <p>
                Create events, track attendance, and manage completions with 
                immutable records stored on the blockchain.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="home__stats">
        <div className="container">
          <div className="grid grid--3">
            <div className="home__stat">
              <div className="home__stat-number">100%</div>
              <div className="home__stat-label">Decentralized</div>
            </div>
            <div className="home__stat">
              <div className="home__stat-number">∞</div>
              <div className="home__stat-label">Scalable</div>
            </div>
            <div className="home__stat">
              <div className="home__stat-number">0</div>
              <div className="home__stat-label">Downtime</div>
            </div>
          </div>
        </div>
      </section>

      <section className="home__cta">
        <div className="container">
          <div className="home__cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join the future of event management on the blockchain.</p>
            <Button 
              variant="accent" 
              size="lg"
              onClick={handleGetStarted}
            >
              {isAuthenticated ? 'Create Your First Event' : 'Sign In Now'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;