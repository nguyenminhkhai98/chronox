import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../hooks/useEvents';
import { Button, Loading } from '../components/common';
import { EventCard } from '../components/common';
import './Events.scss';

const Events: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { events, loading, error, refetch } = useEvents();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  const filteredEvents = events.filter(event => {
    if (filter === 'upcoming') return !event.completed;
    if (filter === 'completed') return event.completed;
    return true;
  });

  const upcomingCount = events.filter(e => !e.completed).length;
  const completedCount = events.filter(e => e.completed).length;

  if (loading) {
    return (
      <div className="events">
        <div className="container">
          <Loading size="lg" text="Loading events..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events">
        <div className="container">
          <div className="events__error">
            <h2>Unable to Load Events</h2>
            <p>{error}</p>
            <Button onClick={refetch}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="events">
      <div className="container">
        <div className="events__header">
          <div className="events__title-section">
            <h1>Events</h1>
            <p className="events__subtitle">
              Discover and join events on the blockchain
            </p>
          </div>
          
          {isAuthenticated && (
            <div className="events__actions">
              <Link to="/create">
                <Button variant="primary" size="lg">
                  Create Event
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="events__filters">
          <div className="events__filter-buttons">
            <button
              className={`events__filter ${filter === 'all' ? 'events__filter--active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Events ({events.length})
            </button>
            <button
              className={`events__filter ${filter === 'upcoming' ? 'events__filter--active' : ''}`}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming ({upcomingCount})
            </button>
            <button
              className={`events__filter ${filter === 'completed' ? 'events__filter--active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed ({completedCount})
            </button>
          </div>
          
          <Button variant="secondary" size="sm" onClick={refetch}>
            Refresh
          </Button>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="events__empty">
            <div className="events__empty-icon">📅</div>
            <h3>No Events Found</h3>
            <p>
              {filter === 'all' 
                ? "There are no events yet. Be the first to create one!"
                : `No ${filter} events found.`
              }
            </p>
            {isAuthenticated && filter === 'all' && (
              <Link to="/create">
                <Button variant="accent">Create First Event</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="events__grid">
            {filteredEvents.map((event) => (
              <EventCard key={event.id.toString()} event={event} />
            ))}
          </div>
        )}

        {!isAuthenticated && events.length > 0 && (
          <div className="events__cta">
            <h3>Want to create your own events?</h3>
            <p>Sign in with Internet Identity to start creating and managing events.</p>
            <Button variant="primary">Sign In to Get Started</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;