import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import settingsApi from '../api/settingsApi';

// Hook to get settings
export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsApi.getAll(),
  });
};

// Hook to update settings
export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => settingsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};

// Hook to get roles
export const useRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => settingsApi.getRoles(),
  });
};

// Hook to update role
export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => settingsApi.updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

// Hook to create role
export const useCreateRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => settingsApi.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};
