import { Principal } from '@dfinity/principal';

export interface EventPayload {
  title: string;
  location: string;
  startTime: bigint;
  completed: boolean;
}

export interface Event extends EventPayload {
  id: bigint;
  creator: Principal;
  attendees: Principal[];
}

export interface EventSummary extends EventPayload {
  id: bigint;
  creator: Principal;
  numOfAttendees: bigint;
}

export interface User {
  principal: Principal;
  isAuthenticated: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}