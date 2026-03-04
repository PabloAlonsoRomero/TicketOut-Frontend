import { User } from './user.model';

export interface Comment {
  id: number;
  body: string;
  isInternal: boolean;
  author: User;
  createdAt: string;
}

export interface CreateCommentRequest {
  body: string;
  isInternal?: boolean;
}
