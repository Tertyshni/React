export type Role = 'user' | 'operator';

export interface UserDto {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  user: UserDto;
}

export interface CategoryDto {
  id: string;
  name: string;
}

export interface PriorityDto {
  id: string;
  name: string;
  weight: number;
}

export interface StatusDto {
  id: string;
  name: string;
}

export interface ContactDto {
  name: string;
  email: string;
  phone: string;
}

export interface CommentDto {
  id: string;
  requestId: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface HistoryItemDto {
  id: string;
  requestId: string;
  fromStatusId: string | null;
  toStatusId: string;
  changedByName: string;
  changedAt: string;
}

export interface RequestDto {
  id: string;
  subject: string;
  description: string;
  categoryId: string;
  priorityId: string;
  statusId: string;
  createdAt: string;
  authorId: string;
  contact: ContactDto;
  comments: CommentDto[];
}

export interface CreateRequestDto {
  subject: string;
  description: string;
  categoryId: string;
  priorityId: string;
  contact: ContactDto;
}

export interface ChangeStatusDto {
  statusId: string;
}

export interface AddCommentDto {
  text: string;
}

export interface ApiErrorDto {
  message: string;
}
