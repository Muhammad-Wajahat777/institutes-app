import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import teachersApi from '../api/teachersApi';

// Hook to get all teachers
export const useTeachers = () => {
  return useQuery({
    queryKey: ['teachers'],
    queryFn: () => teachersApi.getAll(),
  });
};

// Hook to get teacher by ID
export const useTeacher = (id) => {
  return useQuery({
    queryKey: ['teachers', id],
    queryFn: () => teachersApi.getById(id),
    enabled: !!id,
  });
};

// Hook to create a teacher
export const useCreateTeacher = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => teachersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });
};

// Hook to update a teacher
export const useUpdateTeacher = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => teachersApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.invalidateQueries({ queryKey: ['teachers', variables.id] });
    },
  });
};

// Hook to delete a teacher
export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => teachersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });
};
