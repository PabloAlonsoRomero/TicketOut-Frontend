import { TicketPriority, TicketStatus } from '../utils/ticket-enums';

export interface TicketFilter {
  page?: number;
  pageSize?: number;
  status?: TicketStatus;
  priority?: TicketPriority;
  search?: string;
  mine?: boolean;
}
