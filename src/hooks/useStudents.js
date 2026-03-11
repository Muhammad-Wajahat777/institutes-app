import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import studentsApi from '../api/studentsApi';

// Hook to get all students
export const useStudents = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const response = await studentsApi.getAll();
      return response.data;
    },
  });
};

// Hook to get student by ID
export const useStudent = (id) => {
  return useQuery({
    queryKey: ['students', id],
    queryFn: async () => {
      const response = await studentsApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

// Hook to create a student
export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => studentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

// Hook to update a student
export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => studentsApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['students', variables.id] });
    },
  });
};

// Hook to delete a student
export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => studentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

// Hook to get students by course
export const useStudentsByCourse = (courseId) => {
  return useQuery({
    queryKey:['students', 'course', courseId],
    queryFn: async () => {
      const response = await studentsApi.getByCourse(courseId);
      return response.data;
    },
    enabled: !!courseId,
  });
};
