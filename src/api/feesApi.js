import axiosClient from './axiosClient';

const feesApi = {
  // Get all fees with student details
  getAll: () => axiosClient.get('/fees?_expand=student'),

  // Get fee by ID
  getById: (id) => axiosClient.get(`/fees/${id}`),

  // Create new fee record
  create: (data) => axiosClient.post('/fees', data),

  // Update fee record
  update: (id, data) => axiosClient.put(`/fees/${id}`, data),

  // Delete fee record
  delete: (id) => axiosClient.delete(`/fees/${id}`),

  // Get fees by student
  getByStudent: (studentId) => axiosClient.get(`/fees?studentId=${studentId}&_expand=student`),

  // Get fees by status
  getByStatus: (status) => axiosClient.get(`/fees?status=${status}&_expand=student`),

  // Get pending fees
  getPending: () => axiosClient.get('/fees?status=Pending&_expand=student'),

  // Get fees by academic year
  getByAcademicYear: (year) => axiosClient.get(`/fees?academicYear=${year}&_expand=student`),
};

export default feesApi;
