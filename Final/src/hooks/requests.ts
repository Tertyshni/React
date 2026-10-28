import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { requestsApi } from '../api/routes';
import { useNotifications } from '../context/Notifications';
import { getErrorMessage } from '../utils/helpers';
import type { CreateRequestDto, RequestDto } from '../types/data';

export const keys = {
  myRequests: ['requests', 'my'] as const,
  allRequests: ['requests', 'all'] as const,
  request: (id: string) => ['request', id] as const,
  history: (id: string) => ['history', id] as const,
};

export const useMyRequests = (enabled = true) =>
  useQuery({ queryKey: keys.myRequests, queryFn: requestsApi.getMy, enabled });

export const useAllRequests = (enabled = true) =>
  useQuery({ queryKey: keys.allRequests, queryFn: requestsApi.getAll, enabled });

export const useRequest = (id: string) =>
  useQuery({ queryKey: keys.request(id), queryFn: () => requestsApi.getById(id) });

export const useHistory = (id: string) =>
  useQuery({ queryKey: keys.history(id), queryFn: () => requestsApi.getHistory(id) });

export function useCreateRequest(onCreated?: (created: RequestDto) => void) {
  const queryClient = useQueryClient();
  const { notifySuccess, notifyError } = useNotifications();

  return useMutation({
    mutationFn: (data: CreateRequestDto) => requestsApi.create(data),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: keys.myRequests });
      queryClient.invalidateQueries({ queryKey: keys.allRequests });
      notifySuccess('Заявку створено');
      onCreated?.(created);
    },
    onError: (error) => notifyError(`Не вдалося створити заявку: ${getErrorMessage(error)}`),
  });
}

export function useChangeStatus(id: string) {
  const queryClient = useQueryClient();
  const { notifySuccess, notifyError } = useNotifications();

  return useMutation({
    mutationFn: (statusId: string) => requestsApi.changeStatus(id, { statusId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.request(id) });
      queryClient.invalidateQueries({ queryKey: keys.history(id) });
      queryClient.invalidateQueries({ queryKey: keys.allRequests });
      queryClient.invalidateQueries({ queryKey: keys.myRequests });
      notifySuccess('Статус заявки змінено');
    },
    onError: (error) => notifyError(`Не вдалося змінити статус: ${getErrorMessage(error)}`),
  });
}

export function useAddComment(id: string) {
  const queryClient = useQueryClient();
  const { notifySuccess, notifyError } = useNotifications();

  return useMutation({
    mutationFn: (text: string) => requestsApi.addComment(id, text),
    onSuccess: (comment) => {
      queryClient.setQueryData<RequestDto>(keys.request(id), (old) =>
        old ? { ...old, comments: [...old.comments, comment] } : old,
      );
      queryClient.invalidateQueries({ queryKey: keys.request(id) });
      notifySuccess('Коментар додано');
    },
    onError: (error) => notifyError(`Не вдалося додати коментар: ${getErrorMessage(error)}`),
  });
}
