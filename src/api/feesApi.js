import supabase from './supabaseClient';
import { keysToCamel, keysToSnake } from './caseUtils';

const feesApi = {
  // Read all rows from fees table
  getAllFees: async () => {
    const { data, error } = await supabase.from('fees').select('*');
    if (error) throw error;
    return keysToCamel(data);
  },

  // Insert a row into fees table
  insertFee: async (feeData) => {
    const { data, error } = await supabase
      .from('fees')
      .insert(keysToSnake(feeData))
      .select()
      .single();
    if (error) throw error;
    return keysToCamel(data);
  },

  // Update matching row by id
  updateFeeById: async (id, updates) => {
    const { data, error } = await supabase
      .from('fees')
      .update(keysToSnake(updates))
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return keysToCamel(data);
  },

  // Delete matching row by id
  deleteFeeById: async (id) => {
    const { error } = await supabase.from('fees').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // Get all fees with student details
  getAll: async () => {
    const { data, error } = await supabase
      .from('fees')
      .select('*, students(*)');
    if (error) throw error;
    // Flatten the nested student object to match old _expand=student format
    return keysToCamel(data).map((fee) => ({
      ...fee,
      student: fee.students,
      students: undefined,
    }));
  },

  // Get fee by ID
  getById: async (id) => {
    const { data, error } = await supabase.from('fees').select('*').eq('id', id).single();
    if (error) throw error;
    return keysToCamel(data);
  },

  // Create new fee record
  create: async (feeData) => {
    const { data, error } = await supabase
      .from('fees')
      .insert(keysToSnake(feeData))
      .select()
      .single();
    if (error) throw error;
    return keysToCamel(data);
  },

  // Update fee record
  update: async (id, feeData) => {
    const { data, error } = await supabase
      .from('fees')
      .update(keysToSnake(feeData))
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return keysToCamel(data);
  },

  // Delete fee record
  delete: async (id) => {
    const { error } = await supabase.from('fees').delete().eq('id', id);
    if (error) throw error;
  },

  // Get fees by student
  getByStudent: async (studentId) => {
    const { data, error } = await supabase
      .from('fees')
      .select('*, students(*)')
      .eq('student_id', studentId);
    if (error) throw error;
    return keysToCamel(data).map((fee) => ({
      ...fee,
      student: fee.students,
      students: undefined,
    }));
  },

  // Get fees by status
  getByStatus: async (status) => {
    const { data, error } = await supabase
      .from('fees')
      .select('*, students(*)')
      .eq('status', status);
    if (error) throw error;
    return keysToCamel(data).map((fee) => ({
      ...fee,
      student: fee.students,
      students: undefined,
    }));
  },

  // Get pending fees
  getPending: async () => {
    const { data, error } = await supabase
      .from('fees')
      .select('*, students(*)')
      .eq('status', 'Pending');
    if (error) throw error;
    return keysToCamel(data).map((fee) => ({
      ...fee,
      student: fee.students,
      students: undefined,
    }));
  },
};

export default feesApi;
