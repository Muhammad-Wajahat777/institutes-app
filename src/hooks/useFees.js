import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import feesApi from '../api/feesApi';

// Hook to get all fees
export const useFees = () => {
  return useQuery({
    queryKey: ['fees'],
    queryFn: async () => {
      const response = await feesApi.getAll();
      return response.data;
    },
  });
};

// Hook to get fee by ID
export const useFee = (id) => {
  return useQuery({
    queryKey: ['fees', id],
    queryFn: async () => {
      const response = await feesApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

// Hook to create a fee record
export const useCreateFee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => feesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
    },
  });
};

// Hook to update a fee record
export const useUpdateFee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => feesApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
      queryClient.invalidateQueries({ queryKey: ['fees', variables.id] });
    },
  });
};

// Hook to delete a fee record
export const useDeleteFee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => feesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
    },
  });
};

// Hook to get fees by student
export const useFeesByStudent = (studentId) => {
  return useQuery({
    queryKey: ['fees', 'student', studentId],
    queryFn: async () => {
      const response = await feesApi.getByStudent(studentId);
      return response.data;
    },
    enabled: !!studentId,
  });
};

// Hook to get pending fees
export const usePendingFees = () => {
  return useQuery({
    queryKey: ['fees', 'pending'],
    queryFn: async () => {
      const response = await feesApi.getPending();
      return response.data;
    },
  });
};
