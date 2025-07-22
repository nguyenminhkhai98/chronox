import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEvent, useEventActions } from '../hooks/useEvents';
import { Button, Loading } from '../components/common';
import { formatDateTime, isEventUpcoming, getRelativeTime } from '../utils/dateUtils';
import './EventDetail.scss';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, login, principal } = useAuth();
  const { attendEvent, completeEvent, loading: actionLoading, error: actionError, clearError } = useEventActions();

  const eventId = id ? BigInt(id) : BigInt(0);
  const { event, loading, error, refetch } = useEvent(eventId);

  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      navigate('/events');
      return;
    }
  }, [id, navigate]);

  const isAttending = event?.attendees.some(attendee =>
    attendee.toString() === principal?.toString()
  ) || false;

  const isOrganizer = event?.creator.toString() === principal?.toString();
  const canAttend = event && !event.completed && !isAttending && isAuthenticated;
  const isUpcoming = event ? isEventUpcoming(event.startTime) : false;

  const handleAttendEvent = async () => {
    if (!isAuthenticated) {
      await login();
      return;
    }

    try {
      clearError();
      setSuccessMessage('');
      await attendEvent(eventId);
      setSuccessMessage('Successfully registered for the event!');
      await refetch();
    } catch (err) {
      console.error('Failed to attend event:', err);
    }
  };

  const handleCompleteEvent = async () => {
    try {
      clearError();
      setSuccessMessage('');
      await completeEvent(eventId);
      setSuccessMessage('Event marked as completed!');
      await refetch();
    } catch (err) {
      console.error('Failed to complete event:', err);
    }
  };

  const clearMessages = () => {
    setSuccessMessage('');
    clearError();
  };

  if (loading) {
    return (
      <div className="event-detail">
        <div className="container">
          <Loading size="lg" text="Loading event details..." />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="event-detail">
        <div className="container">
          <div className="event-detail__error">
            <h2>Event Not Found</h2>
            <p>{error || 'The requested event could not be found.'}</p>
            <Link to="/events">
              <Button variant="primary">Back to Events</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="event-detail">
      <div className="container">
        <div className="event-detail__header">
          <Link to="/events" className="event-detail__back">
            ← Back to Events
          </Link>
        </div>

        <div className="event-detail__content">
          <div className="event-detail__main">
            <div className="event-detail__title-section">
              <h1 className="event-detail__title">{event.title}</h1>
              <span className={`status ${event.completed ? 'status--completed' : 'status--upcoming'}`}>
                {event.completed ? 'Completed' : 'Upcoming'}
              </span>
            </div>

            <div className="event-detail__info">
              <div className="event-detail__info-item">
                <div className="event-detail__info-icon">📍</div>
                <div>
                  <h3>Location</h3>
                  <p>{event.location}</p>
                </div>
              </div>

              <div className="event-detail__info-item">
                <div className="event-detail__info-icon">🕒</div>
                <div>
                  <h3>Date & Time</h3>
                  <p>{formatDateTime(event.startTime)}</p>
                  {isUpcoming && !event.completed && (
                    <span className="event-detail__relative-time">
                      {getRelativeTime(event.startTime)}
                    </span>
                  )}
                </div>
              </div>

              <div className="event-detail__info-item">
                <div className="event-detail__info-icon">👥</div>
                <div>
                  <h3>Attendees</h3>
                  <p>{event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="event-detail__info-item">
                <div className="event-detail__info-icon">👤</div>
                <div>
                  <h3>Organizer</h3>
                  <p className="event-detail__organizer-id">{event.creator.toString().slice(0, 12)}...</p>
                  {event.creator.toString() === principal?.toString() && (
                    <span className="event-detail__organizer-badge">You</span>
                  )}
                </div>
              </div>

              <div className="event-detail__info-item">
                <div className="event-detail__info-icon">🆔</div>
                <div>
                  <h3>Event ID</h3>
                  <p className="event-detail__event-id">{event.id.toString()}</p>
                </div>
              </div>
            </div>

            {(successMessage || actionError) && (
              <div className={`event-detail__message ${successMessage ? 'event-detail__message--success' : 'event-detail__message--error'}`}>
                <p>{successMessage || actionError}</p>
                <button
                  className="event-detail__message-close"
                  onClick={clearMessages}
                  aria-label="Close message"
                >
                  ×
                </button>
              </div>
            )}

            <div className="event-detail__actions">
              {!isAuthenticated ? (
                <div className="event-detail__auth-prompt">
                  <p>Sign in to attend this event</p>
                  <Button variant="primary" size="lg" onClick={login}>
                    Sign In
                  </Button>
                </div>
              ) : isOrganizer && !event.completed ? (
                <div className="event-detail__organizer-actions">
                  {!isAttending ? (
                    <Button
                      variant="accent"
                      onClick={handleAttendEvent}
                      loading={actionLoading}
                    >
                      Attend Event
                    </Button>
                  ) : (
                    <span className="event-detail__attending-badge">✓ You're attending</span>
                  )}
                  <Button
                    variant="secondary"
                    onClick={handleCompleteEvent}
                    loading={actionLoading}
                  >
                    Mark as Completed
                  </Button>
                </div>
              ) : canAttend ? (
                <Button
                  variant="accent"
                  size="lg"
                  onClick={handleAttendEvent}
                  loading={actionLoading}
                >
                  Attend Event
                </Button>
              ) : isAttending ? (
                <div className="event-detail__attending">
                  <span className="event-detail__attending-badge">✓ You're attending</span>
                </div>
              ) : event.completed ? (
                <div className="event-detail__completed">
                  <span>This event has been completed</span>
                </div>
              ) : (
                <div className="event-detail__cannot-attend">
                  <span>Event registration closed</span>
                </div>
              )}
            </div>
          </div>

          <div className="event-detail__sidebar">
            <div className="event-detail__attendees-card">
              <h3>Attendees ({event.attendees.length})</h3>
              {event.attendees.length > 0 ? (
                <div className="event-detail__attendees-list">
                  {event.attendees.map((attendee, index) => (
                    <div key={index} className="event-detail__attendee">
                      <div className="event-detail__attendee-avatar">
                        {index + 1}
                      </div>
                      <div className="event-detail__attendee-info">
                        <span className="event-detail__attendee-id">
                          {attendee.toString().slice(0, 12)}...
                        </span>
                        {attendee.toString() === principal?.toString() && (
                          <span className="event-detail__attendee-badge">You</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="event-detail__no-attendees">
                  <p>No attendees yet</p>
                  <span>Be the first to join!</span>
                </div>
              )}
            </div>

            <div className="event-detail__blockchain-info">
              <h3>Blockchain Info</h3>
              <div className="event-detail__blockchain-details">
                <div className="event-detail__blockchain-item">
                  <span className="event-detail__blockchain-label">Network:</span>
                  <span>Internet Computer</span>
                </div>
                <div className="event-detail__blockchain-item">
                  <span className="event-detail__blockchain-label">Canister:</span>
                  <span className="event-detail__blockchain-value">ChronoX</span>
                </div>
                <div className="event-detail__blockchain-item">
                  <span className="event-detail__blockchain-label">Status:</span>
                  <span className="event-detail__blockchain-status">✓ Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;