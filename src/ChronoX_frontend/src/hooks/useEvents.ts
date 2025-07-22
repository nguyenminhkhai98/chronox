import { useState, useEffect } from 'react';
import { ChronoX_backend, createActor } from 'declarations/ChronoX_backend';
import { HttpAgent } from '@dfinity/agent';
import { useAuth } from '../contexts/AuthContext';
import { Event, EventSummary, EventPayload } from '../types';

export const useEvents = () => {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await ChronoX_backend.getEvents();
      setEvents(result);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    refetch: fetchEvents
  };
};

export const useEvent = (eventId: bigint) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await ChronoX_backend.getEventDetail(eventId);
      setEvent(result);
    } catch (err) {
      console.error('Failed to fetch event:', err);
      setError('Failed to load event details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId !== undefined) {
      fetchEvent();
    }
  }, [eventId]);

  return {
    event,
    loading,
    error,
    refetch: fetchEvent
  };
};

export const useEventActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { identity } = useAuth();

  const getAuthenticatedActor = async () => {
    if (!identity) {
      throw new Error('User not authenticated');
    }

    const agent = new HttpAgent({
      host: import.meta.env.DFX_NETWORK === 'ic' ? 'https://ic0.app' : 'http://localhost:4943',
      identity,
    });

    if (import.meta.env.DFX_NETWORK !== 'ic') {
      await agent.fetchRootKey();
    }

    return createActor(import.meta.env.CANISTER_ID_CHRONOX_BACKEND, {
      agent,
    });
  };

  const createEvent = async (payload: EventPayload) => {
    try {
      setLoading(true);
      setError(null);
      const actor = await getAuthenticatedActor();
      const eventId = await actor.createEvent(payload);
      return eventId;
    } catch (err) {
      console.error('Failed to create event:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create event. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const attendEvent = async (eventId: bigint) => {
    try {
      setLoading(true);
      setError(null);
      const actor = await getAuthenticatedActor();
      await actor.attendEvent(eventId);
    } catch (err) {
      console.error('Failed to attend event:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to attend event. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const completeEvent = async (eventId: bigint) => {
    try {
      setLoading(true);
      setError(null);
      const actor = await getAuthenticatedActor();
      await actor.completeEvent(eventId);
    } catch (err) {
      console.error('Failed to complete event:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete event. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createEvent,
    attendEvent,
    completeEvent,
    loading,
    error,
    clearError: () => setError(null)
  };
};