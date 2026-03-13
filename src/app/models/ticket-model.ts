import { TicketPriority, TicketStatus } from '../utils/ticket-enums';
import { User } from './user.model';
import { Comment } from './commet-model';
import { TicketEvent } from './event-model';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  createdBy: User;
  assignedTo?: User | null;
  createdAt: string;
  updatedAt: string;
  closedAt?: string | null;
  comments?: Comment[];
  events?: TicketEvent[];
}

//Crear / Actualizar Ticket
export interface CreateTicketRequest {
  title: string;
  description: string;
  priority?: TicketPriority;
  category?: string;
}

export interface UpdateTicketRequest {
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: string;
  assignedToId?: number | null;
}
