import { useQuery } from '@tanstack/react-query';
import { dictionariesApi } from '../api/routes';

const STALE = 5 * 60 * 1000;

export const useStatuses = () =>
  useQuery({ queryKey: ['statuses'], queryFn: dictionariesApi.statuses, staleTime: STALE });

export const useCategories = () =>
  useQuery({ queryKey: ['categories'], queryFn: dictionariesApi.categories, staleTime: STALE });

export const usePriorities = () =>
  useQuery({ queryKey: ['priorities'], queryFn: dictionariesApi.priorities, staleTime: STALE });
