import axiosClient from './axiosClient';

const settingsApi = {
  // Get all settings
  getAll: () => axiosClient.get('/settings'),

  // Get settings by ID
  getById: (id) => axiosClient.get(`/settings/${id}`),

  // Update settings
  update: (id, data) => axiosClient.put(`/settings/${id}`, data),

  // Get academic years
  getAcademicYears: () => axiosClient.get('/academicYears'),

  // Update academic year
  updateAcademicYear: (id, data) => axiosClient.put(`/academicYears/${id}`, data),

  // Create academic year
  createAcademicYear: (data) => axiosClient.post('/academicYears', data),

  // Get fee configurations
  getFeeConfigurations: () => axiosClient.get('/feeConfigurations'),

  // Update fee configuration
  updateFeeConfiguration: (id, data) => axiosClient.put(`/feeConfigurations/${id}`, data),

  // Create fee configuration
  createFeeConfiguration: (data) => axiosClient.post('/feeConfigurations', data),

  // Get roles
  getRoles: () => axiosClient.get('/roles'),

  // Update role
  updateRole: (id, data) => axiosClient.put(`/roles/${id}`, data),

  // Create role
  createRole: (data) => axiosClient.post('/roles', data),
};

export default settingsApi;
