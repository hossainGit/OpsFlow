export type Role = 'admin' | 'manager' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
}

export type TicketStatus = 'open' | 'in-progress' | 'pending-approval' | 'approved' | 'rejected' | 'completed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface TicketHistoryEvent {
  id: string;
  actorId: string;
  action: string;
  // e.g., "changed status from Open to In-Progress"
  detail?: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  creatorId: string;
  assigneeId: string | null;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  history: TicketHistoryEvent[];
}
