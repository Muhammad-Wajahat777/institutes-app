import supabase from './supabase';
import { keysToCamel } from './caseUtils';

const teachersApi = {
  // Get all teachers
  getAll: async () => {
    const { data: teachers, error } = await supabase
      .from('teachers')
      .select('*');
    if (error) throw error;
    return keysToCamel(teachers);
  },

  // Get teacher by ID
  getById: async (id) => {
    const { data, error } = await supabase.from('teachers').select('*').eq('id', id).single();
    if (error) throw error;
    return keysToCamel(data);
  },

  // Create new teacher
  create: async (teacherData) => {
    const insertPayload = {
      first_name: teacherData.firstName,
      last_name: teacherData.lastName,
      email: teacherData.email,
      phone: teacherData.phone,
      subject_specialization: teacherData.subjectSpecialization || teacherData.subject,
      qualification: teacherData.qualification,
      salary: teacherData.salary,
      status: teacherData.status,
      experience: teacherData.experience,
      address: teacherData.address,
    };

    const { data, error } = await supabase
      .from('teachers')
      .insert([insertPayload])
      .select();
    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error('Teacher was not created. Please check Supabase insert policy.');
    }
    return keysToCamel(data?.[0] || null);
  },

  // Update teacher
  update: async (id, teacherData) => {
    if (id === undefined || id === null || id === '') {
      throw new Error('Teacher id is missing. Unable to update this row.');
    }

    const updatePayload = {
      first_name: teacherData.firstName,
      last_name: teacherData.lastName,
      email: teacherData.email,
      phone: teacherData.phone,
      subject_specialization: teacherData.subjectSpecialization || teacherData.subject,
      qualification: teacherData.qualification,
      salary: teacherData.salary,
      status: teacherData.status,
      experience: teacherData.experience,
      address: teacherData.address,
    };

    const { data, error } = await supabase
      .from('teachers')
      .update(updatePayload)
      .eq('id', id)
      .select();
    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error('No teacher row was updated. Check row id and Supabase RLS update policy.');
    }
    return keysToCamel(data?.[0] || null);
  },

  // Delete teacher
  delete: async (id) => {
    const { data, error } = await supabase
      .from('teachers')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return keysToCamel(data);
  },

  // Get teachers by subject
  getBySubject: async (subject) => {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('subject_specialization', subject);
    if (error) throw error;
    return keysToCamel(data);
  },

  // Search teachers
  search: async (query) => {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`);
    if (error) throw error;
    return keysToCamel(data);
  },
};

export default teachersApi;
