import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EventSummary } from '../../types';
import { formatDateTime, isEventUpcoming, getRelativeTime } from '../../utils/dateUtils';
import Card from './Card';
import './EventCard.scss';

interface EventCardProps {
  event: EventSummary;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();
  const isUpcoming = isEventUpcoming(event.startTime);
  
  const handleClick = () => {
    navigate(`/events/${event.id.toString()}`);
  };

  return (
    <Card className="event-card" interactive onClick={handleClick}>
      <div className="event-card__header">
        <h3 className="event-card__title">{event.title}</h3>
        <span className={`status ${event.completed ? 'status--completed' : 'status--upcoming'}`}>
          {event.completed ? 'Completed' : 'Upcoming'}
        </span>
      </div>
      
      <div className="event-card__content">
        <div className="event-card__detail">
          <div className="event-card__icon">📍</div>
          <span className="event-card__text">{event.location}</span>
        </div>
        
        <div className="event-card__detail">
          <div className="event-card__icon">🕒</div>
          <div className="event-card__time">
            <span className="event-card__datetime">{formatDateTime(event.startTime)}</span>
            {isUpcoming && !event.completed && (
              <span className="event-card__relative">{getRelativeTime(event.startTime)}</span>
            )}
          </div>
        </div>
        
        <div className="event-card__detail">
          <div className="event-card__icon">👥</div>
          <span className="event-card__text">
            {Number(event.numOfAttendees)} attendee{Number(event.numOfAttendees) !== 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="event-card__detail">
          <div className="event-card__icon">👤</div>
          <span className="event-card__text event-card__organizer">
            Organizer: {event.creator.toString().slice(0, 8)}...
          </span>
        </div>
      </div>
      
      <div className="event-card__footer">
        <span className="event-card__action">View Details →</span>
      </div>
    </Card>
  );
};

export default EventCard;