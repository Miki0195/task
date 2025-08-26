import { useQuery } from '@tanstack/react-query';
import { formApi } from '../services/api';

export const useFormDefinition = () => {
  return useQuery({
    queryKey: ['form-definition'],
    queryFn: formApi.getFormDefinition,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

export const useChoiceOptions = (key: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['choice-options', key],
    queryFn: () => formApi.getChoiceOptions(key),
    enabled: enabled && !!key,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
  });
};
