import supabase from './supabaseClient';

const dashboardApi = {
  // Get live dashboard stats from real tables
  getStats: async () => {
    const [
      { count: totalStudents, error: e1 },
      { count: activeStudents, error: e2 },
      { count: inactiveStudents, error: e3 },
      { count: totalTeachers, error: e4 },
      { count: totalCourses, error: e5 },
      { data: feesData, error: e6 },
    ] = await Promise.all([
      supabase.from('students').select('*', { count: 'exact', head: true }),
      supabase.from('students').select('*', { count: 'exact', head: true }).eq('status', 'Active'),
      supabase.from('students').select('*', { count: 'exact', head: true }).eq('status', 'Inactive'),
      supabase.from('teachers').select('*', { count: 'exact', head: true }),
      supabase.from('courses').select('*', { count: 'exact', head: true }),
      supabase.from('fees').select('amount_paid, amount_due, status'),
    ]);

    const err = e1 || e2 || e3 || e4 || e5 || e6;
    if (err) throw err;

    const totalFeesCollected = (feesData || []).reduce((sum, f) => sum + (f.amount_paid || 0), 0);
    const pendingFees = (feesData || [])
      .filter(f => f.status !== 'Paid')
      .reduce((sum, f) => sum + (f.amount_due || 0), 0);

    return [{
      totalStudents: totalStudents || 0,
      activeStudents: activeStudents || 0,
      inactiveStudents: inactiveStudents || 0,
      totalTeachers: totalTeachers || 0,
      totalCourses: totalCourses || 0,
      totalFeesCollected,
      pendingFees,
    }];
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
