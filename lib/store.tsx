'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { User, Ticket, Role, TicketStatus, TicketHistoryEvent, Comment } from './types';

// Mock Data
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alice Admin', email: 'alice@company.com', avatar: 'https://picsum.photos/seed/u1/100/100', role: 'admin' },
  { id: 'u2', name: 'Mark Manager', email: 'mark@company.com', avatar: 'https://picsum.photos/seed/u2/100/100', role: 'manager' },
  { id: 'u3', name: 'Emma Employee', email: 'emma@company.com', avatar: 'https://picsum.photos/seed/u3/100/100', role: 'employee' },
  { id: 'u4', name: 'Liam Employee', email: 'liam@company.com', avatar: 'https://picsum.photos/seed/u4/100/100', role: 'employee' },
];

const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'REQ-1042',
    title: 'Upgrade Database to v14',
    description: 'We need to upgrade the primary Postgres database during the weekend maintenance window to support new JSONB features.',
    status: 'in-progress',
    priority: 'high',
    creatorId: 'u2',
    assigneeId: 'u1',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    comments: [
      { id: 'c1', authorId: 'u1', content: 'I have scheduled this for Sunday 2AM.', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
    ],
    history: [
      { id: 'h1', actorId: 'u2', action: 'created ticket', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'h2', actorId: 'u1', action: 'assigned to self', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'h3', actorId: 'u1', action: 'changed status', detail: 'Open to In-Progress', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    ]
  },
  {
    id: 'REQ-1043',
    title: 'Design System Update',
    description: 'Update the core ui components to match the newly approved brand guidelines.',
    status: 'pending-approval',
    priority: 'medium',
    creatorId: 'u3',
    assigneeId: null,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    comments: [],
    history: [
      { id: 'h4', actorId: 'u3', action: 'created ticket', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'h5', actorId: 'u3', action: 'changed status', detail: 'Open to Pending-Approval', createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    ]
  },
  {
    id: 'REQ-1044',
    title: 'New Laptop Request - Engineering',
    description: 'Requesting a Macbook Pro M3 Max for the new backend hire starting next week.',
    status: 'approved',
    priority: 'high',
    creatorId: 'u2',
    assigneeId: 'u1',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    comments: [
       { id: 'c2', authorId: 'u1', content: 'Approved. Procurement will order today.', createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() }
    ],
    history: [
      { id: 'h6', actorId: 'u2', action: 'created ticket', createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'h7', actorId: 'u1', action: 'approved ticket', createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
    ]
  },
  {
    id: 'REQ-1045',
    title: 'Q3 Marketing Budget Adjustment',
    description: 'Need approval to shift 15% of the Q3 budget from paid social to event sponsorships.',
    status: 'open',
    priority: 'medium',
    creatorId: 'u4',
    assigneeId: null,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    comments: [],
    history: [
      { id: 'h8', actorId: 'u4', action: 'created ticket', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    ]
  }
];

interface AppContextType {
  currentUser: User;
  setCurrentUserId: (id: string) => void;
  users: User[];
  tickets: Ticket[];
  addTicket: (t: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'history'>) => void;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void;
  addComment: (ticketId: string, content: string) => void;
  updateProfile: (details: Partial<User>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('u1'); // Start as Admin
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);

  useEffect(() => {
    const storedUserId = localStorage.getItem('opsflow_currentUserId');
    const storedUsers = localStorage.getItem('opsflow_users');
    const storedTickets = localStorage.getItem('opsflow_tickets');

    if (storedUserId) setCurrentUserId(storedUserId);
    if (storedUsers) setUsers(JSON.parse(storedUsers));
    if (storedTickets) setTickets(JSON.parse(storedTickets));
    
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('opsflow_currentUserId', currentUserId);
      localStorage.setItem('opsflow_users', JSON.stringify(users));
      localStorage.setItem('opsflow_tickets', JSON.stringify(tickets));
    }
  }, [currentUserId, users, tickets, isHydrated]);

  const currentUser = useMemo(() => users.find(u => u.id === currentUserId) || users[0], [currentUserId, users]);

  const addTicket = (payload: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'history'>) => {
    const newTicket: Ticket = {
      ...payload,
      id: `REQ-${1045 + tickets.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      history: [{
        id: Math.random().toString(36).substr(2, 9),
        actorId: currentUser.id,
        action: 'created ticket',
        createdAt: new Date().toISOString()
      }]
    };
    setTickets([newTicket, ...tickets]);
  };

  const updateTicketStatus = (ticketId: string, status: TicketStatus) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const historyEvent: TicketHistoryEvent = {
          id: Math.random().toString(36).substr(2, 9),
          actorId: currentUser.id,
          action: 'changed status',
          detail: `${t.status} to ${status}`,
          createdAt: new Date().toISOString()
        };
        return {
          ...t,
          status,
          updatedAt: new Date().toISOString(),
          history: [historyEvent, ...t.history].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        };
      }
      return t;
    }));
  };

  const addComment = (ticketId: string, content: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const comment: Comment = {
          id: Math.random().toString(36).substr(2, 9),
          authorId: currentUser.id,
          content,
          createdAt: new Date().toISOString()
        };
        return {
          ...t,
          updatedAt: new Date().toISOString(),
          comments: [...t.comments, comment]
        };
      }
      return t;
    }));
  };

  const updateProfile = (details: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === currentUserId ? { ...u, ...details } : u));
  };

  // Prevent hydration mismatch
  if (!isHydrated) return null;

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUserId,
      users,
      tickets,
      addTicket,
      updateTicketStatus,
      addComment,
      updateProfile
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppStore must be used within an AppProvider");
  return context;
}
