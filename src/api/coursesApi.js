import supabase from './supabaseClient';
import { keysToCamel } from './caseUtils';

const coursesApi = {
  // Get all courses
  getAll: async () => {
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*');
    if (error) throw error;
    return keysToCamel(courses);
  },

  // Get course by ID
  getById: async (id) => {
    const { data, error } = await supabase.from('courses').select('*').eq('id', id).single();
    if (error) throw error;
    return keysToCamel(data);
  },

  // Create new course
  create: async (courseData) => {
    const insertPayload = {
      name: courseData.name,
      code: courseData.code,
      duration: courseData.duration,
      total_fees: courseData.totalFees,
      description: courseData.description,
      teacher_id: courseData.teacherId,
      status: courseData.status,
      seats: courseData.seats,
    };

    const { data, error } = await supabase
      .from('courses')
      .insert([insertPayload])
      .select();
    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error('Course was not created. Please check Supabase insert policy.');
    }
    return keysToCamel(data?.[0] || null);
  },

  // Update course
  update: async (id, courseData) => {
    if (id === undefined || id === null || id === '') {
      throw new Error('Course id is missing. Unable to update this row.');
    }

    const updatePayload = {
      name: courseData.name,
      code: courseData.code,
      duration: courseData.duration,
      total_fees: courseData.totalFees,
      description: courseData.description,
      teacher_id: courseData.teacherId,
      status: courseData.status,
      seats: courseData.seats,
    };

    const { data, error } = await supabase
      .from('courses')
      .update(updatePayload)
      .eq('id', id)
      .select();
    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error('No course row was updated. Check row id and Supabase RLS update policy.');
    }
    return keysToCamel(data?.[0] || null);
  },

  // Delete course
  delete: async (id) => {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Get active courses
  getActive: async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('status', 'Active');
    if (error) throw error;
    return keysToCamel(data);
  },

  // Search courses
  search: async (query) => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .ilike('name', `%${query}%`);
    if (error) throw error;
    return keysToCamel(data);
  },
};

export default coursesApi;
