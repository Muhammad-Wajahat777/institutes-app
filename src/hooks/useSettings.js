import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import settingsApi from '../api/settingsApi';

// Hook to get settings
export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await settingsApi.getAll();
      return response.data;
    },
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

// Hook to get academic years
export const useAcademicYears = () => {
  return useQuery({
    queryKey: ['academicYears'],
    queryFn: async () => {
      const response = await settingsApi.getAcademicYears();
      return response.data;
    },
  });
};

// Hook to update academic year
export const useUpdateAcademicYear = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => settingsApi.updateAcademicYear(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academicYears'] });
    },
  });
};

// Hook to create academic year
export const useCreateAcademicYear = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => settingsApi.createAcademicYear(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academicYears'] });
    },
  });
};

// Hook to get fee configurations
export const useFeeConfigurations = () => {
  return useQuery({
    queryKey: ['feeConfigurations'],
    queryFn: async () => {
      const response = await settingsApi.getFeeConfigurations();
      return response.data;
    },
  });
};

// Hook to update fee configuration
export const useUpdateFeeConfiguration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => settingsApi.updateFeeConfiguration(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feeConfigurations'] });
    },
  });
};

// Hook to create fee configuration
export const useCreateFeeConfiguration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => settingsApi.createFeeConfiguration(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feeConfigurations'] });
    },
  });
};

// Hook to get roles
export const useRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await settingsApi.getRoles();
      return response.data;
    },
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
