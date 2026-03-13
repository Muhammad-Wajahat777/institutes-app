import supabase from './supabaseClient';
import { keysToCamel } from './caseUtils';

const dashboardApi = {
  // Get dashboard stats
  getStats: async () => {
    const { data, error } = await supabase.from('stats').select('*');
    if (error) throw error;
    return keysToCamel(data);
  },

  // Get notifications
  getNotifications: async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('date', { ascending: false });
    if (error) throw error;
    return keysToCamel(data);
  },

  // Mark notification as read
  markNotificationRead: async (id) => {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return keysToCamel(data);
  },

  // Mark all notifications as read
  markAllNotificationsRead: async () => {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('read', false)
      .select();
    if (error) throw error;
    return keysToCamel(data);
  },

  // Get unread notification count
  getUnreadCount: async () => {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('read', false);
    if (error) throw error;
    return count;
  },
};

export default dashboardApi;
