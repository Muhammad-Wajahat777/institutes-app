import supabase from './supabaseClient';
import { keysToCamel } from './caseUtils';

const studentsApi = {
  // Get all students
  getAll: async () => {
    let { data: students, error } = await supabase
      .from('students')
      .select('*');
    if (error) throw error;
    return keysToCamel(students);
  },

  // Get student by ID
  getById: async (id) => {
    const { data, error } = await supabase.from('students').select('*').eq('id', id).single();
    if (error) throw error;
    return keysToCamel(data);
  },

  // Create new student
  create: async (studentData) => {
    const insertPayload = {
      first_name: studentData.firstName,
      last_name: studentData.lastName,
      roll_no: studentData.rollNo,
      email: studentData.email,
      phone: studentData.phone,
      course_id: studentData.courseId,
      status: studentData.status,
      admission_date: studentData.admissionDate,
      date_of_birth: studentData.dateOfBirth,
      gender: studentData.gender,
      address: studentData.address,
      father_name: studentData.fatherName,
      mother_name: studentData.motherName,
    };

    const { data, error } = await supabase
      .from('students')
      .insert([insertPayload])
      .select();
    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error('Student was not created. Please check Supabase insert policy.');
    }
    return keysToCamel(data?.[0] || null);
  },

  // Update student
  update: async (id, studentData) => {
    if (id === undefined || id === null || id === '') {
      throw new Error('Student id is missing. Unable to update this row.');
    }

    const updatePayload = {
      first_name: studentData.firstName,
      last_name: studentData.lastName,
      roll_no: studentData.rollNo,
      email: studentData.email,
      phone: studentData.phone,
      course_id: studentData.courseId,
      status: studentData.status,
      admission_date: studentData.admissionDate,
      date_of_birth: studentData.dateOfBirth,
      gender: studentData.gender,
      address: studentData.address,
      father_name: studentData.fatherName,
      mother_name: studentData.motherName,
    };

    const { data, error } = await supabase
      .from('students')
      .update(updatePayload)
      .eq('id', id)
      .select();
    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error('No student row was updated. Check row id and Supabase RLS update policy.');
    }
    return keysToCamel(data?.[0] || null);
  },

  // Delete student
  delete: async (id) => {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Get students by course
  getByCourse: async (courseId) => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('course_id', courseId);
    if (error) throw error;
    return keysToCamel(data);
  },

  // Search students
  search: async (query) => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`);
    if (error) throw error;
    return keysToCamel(data);
  },

  // Get students with pagination
  getPaginated: async (page = 1, limit = 10) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await supabase
      .from('students')
      .select('*', { count: 'exact' })
      .range(from, to);
    if (error) throw error;
    return { data: keysToCamel(data), total: count };
  },
};

export default studentsApi;
