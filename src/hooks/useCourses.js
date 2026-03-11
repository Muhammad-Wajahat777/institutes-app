import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import coursesApi from '../api/coursesApi';

// Hook to get all courses
export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await coursesApi.getAll();
      return response.data;
    },
  });
};

// Hook to get course by ID
export const useCourse = (id) => {
  return useQuery({
    queryKey: ['courses', id],
    queryFn: async () => {
      const response = await coursesApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

// Hook to create a course
export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => coursesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

// Hook to update a course
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => coursesApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses', variables.id] });
    },
  });
};

// Hook to delete a course
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => coursesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

// Hook to get active courses
export const useActiveCourses = () => {
  return useQuery({
    queryKey: ['courses', 'active'],
    queryFn: async () => {
      const response = await coursesApi.getActive();
      return response.data;
    },
  });
};
