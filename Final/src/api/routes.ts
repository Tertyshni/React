import { api } from './http';
import type {
  CategoryDto,
  ChangeStatusDto,
  CommentDto,
  CreateRequestDto,
  HistoryItemDto,
  LoginRequestDto,
  LoginResponseDto,
  PriorityDto,
  RequestDto,
  StatusDto,
  UserDto,
} from '../types/data';


export const authApi = {
  login: (data: LoginRequestDto) =>
    api.post<LoginResponseDto>('/auth/login', data).then((r) => r.data),
  me: () => api.get<UserDto>('/auth/me').then((r) => r.data),
};

export const requestsApi = {
  getMy: () => api.get<RequestDto[]>('/requests/my').then((r) => r.data),
  getAll: () => api.get<RequestDto[]>('/requests').then((r) => r.data),
  getById: (id: string) => api.get<RequestDto>(`/requests/${id}`).then((r) => r.data),
  create: (data: CreateRequestDto) =>
    api.post<RequestDto>('/requests', data).then((r) => r.data),
  changeStatus: (id: string, data: ChangeStatusDto) =>
    api.patch<RequestDto>(`/requests/${id}/status`, data).then((r) => r.data),
  addComment: (id: string, text: string) =>
    api.post<CommentDto>(`/requests/${id}/comments`, { text }).then((r) => r.data),
  getHistory: (id: string) =>
    api.get<HistoryItemDto[]>(`/requests/${id}/history`).then((r) => r.data),
};

export const dictionariesApi = {
  categories: () => api.get<CategoryDto[]>('/categories').then((r) => r.data),
  priorities: () => api.get<PriorityDto[]>('/priorities').then((r) => r.data),
  statuses: () => api.get<StatusDto[]>('/request-statuses').then((r) => r.data),
};
