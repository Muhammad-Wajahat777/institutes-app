import axiosClient from './axiosClient';

const studentsApi = {
  // Get all students
  getAll: () => axiosClient.get('/students'),

  // Get student by ID
  getById: (id) => axiosClient.get(`/students/${id}`),

  // Create new student
  create: (data) => axiosClient.post('/students', data),

  // Update student
  update: (id, data) => axiosClient.put(`/students/${id}`, data),

  // Delete student
  delete: (id) => axiosClient.delete(`/students/${id}`),

  // Get students by course
  getByCourse: (courseId) => axiosClient.get(`/students?courseId=${courseId}`),

  // Search students
  search: (query) => axiosClient.get(`/students?q=${query}`),

  // Get students with pagination
  getPaginated: (page = 1, limit = 10) => 
    axiosClient.get(`/students?_page=${page}&_limit=${limit}`),
};

export default studentsApi;
