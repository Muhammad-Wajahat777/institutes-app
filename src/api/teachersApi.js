import axiosClient from './axiosClient';

const teachersApi = {
  // Get all teachers
  getAll: () => axiosClient.get('/teachers'),

  // Get teacher by ID
  getById: (id) => axiosClient.get(`/teachers/${id}`),

  // Create new teacher
  create: (data) => axiosClient.post('/teachers', data),

  // Update teacher
  update: (id, data) => axiosClient.put(`/teachers/${id}`, data),

  // Delete teacher
  delete: (id) => axiosClient.delete(`/teachers/${id}`),

  // Get teachers by subject
  getBySubject: (subject) => axiosClient.get(`/teachers?subjectSpecialization=${subject}`),

  // Search teachers
  search: (query) => axiosClient.get(`/teachers?q=${query}`),
};

export default teachersApi;
