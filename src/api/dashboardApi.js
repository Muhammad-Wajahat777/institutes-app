import axiosClient from './axiosClient';

const dashboardApi = {
  // Get dashboard stats
  getStats: () => axiosClient.get('/stats'),

  // Get notifications
  getNotifications: () => axiosClient.get('/notifications'),

  // Mark notification as read
  markNotificationRead: (id) => 
    axiosClient.patch(`/notifications/${id}`, { read: true }),

  // Mark all notifications as read
  markAllNotificationsRead: () => 
    axiosClient.get('/notifications').then((response) => {
      const notifications = response.data;
      return Promise.all(
        notifications.map((notification) =>
          axiosClient.patch(`/notifications/${notification.id}`, { read: true })
        )
      );
    }),

  // Get unread notification count
  getUnreadCount: () => 
    axiosClient.get('/notifications?read=false').then((response) => response.data.length),
};

export default dashboardApi;
