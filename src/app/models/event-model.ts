import { EventType } from '../utils/ticket-enums';
import { User } from './user.model';

export interface TicketEventPayload {
  before?: unknown;
  after?: unknown;
  details?: string;
}

export interface TicketEvent {
  id: number;
  type: EventType;
  payloadJson: TicketEventPayload;
  actor: User;
  createdAt: string;
}
