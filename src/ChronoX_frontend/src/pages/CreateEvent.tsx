import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEventActions } from '../hooks/useEvents';
import { Button, Input, Loading } from '../components/common';
import { convertToTimestamp } from '../utils/dateUtils';
import { EventPayload } from '../types';
import './CreateEvent.scss';

const CreateEvent: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const { createEvent, loading, error, clearError } = useEventActions();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    startTime: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'Event title is required';
    } else if (formData.title.length < 3) {
      errors.title = 'Title must be at least 3 characters long';
    }

    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    }

    if (!formData.startTime) {
      errors.startTime = 'Start time is required';
    } else {
      const selectedDate = new Date(formData.startTime);
      const now = new Date();
      if (selectedDate <= now) {
        errors.startTime = 'Start time must be in the future';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear global error
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      await login();
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      const payload: EventPayload = {
        title: formData.title.trim(),
        location: formData.location.trim(),
        startTime: convertToTimestamp(formData.startTime),
        completed: false
      };

      const eventId = await createEvent(payload);
      navigate(`/events/${eventId.toString()}`);
    } catch (err) {
      // Error is handled by the hook
      console.error('Failed to create event:', err);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // Minimum 30 minutes from now
    return now.toISOString().slice(0, 16);
  };

  if (!isAuthenticated) {
    return (
      <div className="create-event">
        <div className="container">
          <div className="create-event__auth-required">
            <div className="create-event__auth-icon">🔐</div>
            <h2>Authentication Required</h2>
            <p>You need to sign in with Internet Identity to create events.</p>
            <Button variant="primary" size="lg" onClick={login}>
              Sign In to Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-event">
      <div className="container">
        <div className="create-event__header">
          <h1>Create New Event</h1>
          <p>Create a new event on the blockchain with transparent attendance tracking.</p>
        </div>

        <div className="create-event__content">
          <form className="create-event__form" onSubmit={handleSubmit}>
            <div className="create-event__form-group">
              <Input
                label="Event Title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                error={validationErrors.title}
                placeholder="Enter event title..."
                required
                disabled={loading}
              />
            </div>

            <div className="create-event__form-group">
              <Input
                label="Location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                error={validationErrors.location}
                placeholder="Enter event location..."
                helperText="Can be a physical address or virtual meeting link"
                required
                disabled={loading}
              />
            </div>

            <div className="create-event__form-group">
              <Input
                label="Start Date & Time"
                name="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={handleChange}
                error={validationErrors.startTime}
                min={getMinDateTime()}
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="create-event__error">
                <strong>Error:</strong> {error}
              </div>
            )}

            <div className="create-event__actions">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/events')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                disabled={loading}
              >
                Create Event
              </Button>
            </div>
          </form>

          <div className="create-event__preview">
            <h3>Preview</h3>
            <div className="create-event__preview-card">
              <div className="create-event__preview-header">
                <h4>{formData.title || 'Event Title'}</h4>
                <span className="status status--upcoming">Upcoming</span>
              </div>
              
              <div className="create-event__preview-details">
                <div className="create-event__preview-detail">
                  <span className="create-event__preview-icon">📍</span>
                  <span>{formData.location || 'Event Location'}</span>
                </div>
                
                <div className="create-event__preview-detail">
                  <span className="create-event__preview-icon">🕒</span>
                  <span>
                    {formData.startTime 
                      ? new Date(formData.startTime).toLocaleString()
                      : 'Select date and time'
                    }
                  </span>
                </div>
                
                <div className="create-event__preview-detail">
                  <span className="create-event__preview-icon">👥</span>
                  <span>0 attendees</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;