import supabase from './supabaseClient';
import { keysToCamel, keysToSnake } from './caseUtils';

const settingsApi = {
  // Get all settings
  getAll: async () => {
    const { data, error } = await supabase.from('settings').select('*');
    if (error) throw error;
    return keysToCamel(data);
  },

  // Get settings by ID
  getById: async (id) => {
    const { data, error } = await supabase.from('settings').select('*').eq('id', id).single();
    if (error) throw error;
    return keysToCamel(data);
  },

  // Update settings
  update: async (id, settingsData) => {
    const { data, error } = await supabase
      .from('settings')
      .update(keysToSnake(settingsData))
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return keysToCamel(data);
  },

  // Get academic years
  getAcademicYears: async () => {
    const { data, error } = await supabase.from('academic_years').select('*');
    if (error) throw error;
    return keysToCamel(data);
  },

  // Update academic year
  updateAcademicYear: async (id, yearData) => {
    const { data, error } = await supabase
      .from('academic_years')
      .update(keysToSnake(yearData))
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return keysToCamel(data);
  },

  // Create academic year
  createAcademicYear: async (yearData) => {
    const { data, error } = await supabase
      .from('academic_years')
      .insert(keysToSnake(yearData))
      .select()
      .single();
    if (error) throw error;
    return keysToCamel(data);
  },

  // Get fee configurations
  getFeeConfigurations: async () => {
    const { data, error } = await supabase.from('fee_configurations').select('*');
    if (error) throw error;
    return keysToCamel(data);
  },

  // Update fee configuration
  updateFeeConfiguration: async (id, configData) => {
    const { data, error } = await supabase
      .from('fee_configurations')
      .update(keysToSnake(configData))
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return keysToCamel(data);
  },

  // Create fee configuration
  createFeeConfiguration: async (configData) => {
    const { data, error } = await supabase
      .from('fee_configurations')
      .insert(keysToSnake(configData))
      .select()
      .single();
    if (error) throw error;
    return keysToCamel(data);
  },

  // Get roles
  getRoles: async () => {
    const { data, error } = await supabase.from('roles').select('*');
    if (error) throw error;
    return keysToCamel(data);
  },

  // Update role
  updateRole: async (id, roleData) => {
    const { data, error } = await supabase
      .from('roles')
      .update(keysToSnake(roleData))
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return keysToCamel(data);
  },

  // Create role
  createRole: async (roleData) => {
    const { data, error } = await supabase
      .from('roles')
      .insert(keysToSnake(roleData))
      .select()
      .single();
    if (error) throw error;
    return keysToCamel(data);
  },
};

export default settingsApi;
