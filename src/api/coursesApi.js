import axiosClient from './axiosClient';

const coursesApi = {
  // Get all courses
  getAll: () => axiosClient.get('/courses'),

  // Get course by ID
  getById: (id) => axiosClient.get(`/courses/${id}`),

  // Create new course
  create: (data) => axiosClient.post('/courses', data),

  // Update course
  update: (id, data) => axiosClient.put(`/courses/${id}`, data),

  // Delete course
  delete: (id) => axiosClient.delete(`/courses/${id}`),

  // Get active courses
  getActive: () => axiosClient.get('/courses?status=Active'),

  // Search courses
  search: (query) => axiosClient.get(`/courses?q=${query}`),
};

export default coursesApi;
