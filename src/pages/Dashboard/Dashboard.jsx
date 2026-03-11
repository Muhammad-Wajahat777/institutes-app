import { Card, Col, Row, Statistic, Typography, Space, Spin, List, Tag, Badge, Button } from 'antd';
import {
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  BellOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useDashboardStats, useNotifications } from '../../hooks/useDashboard';

const { Title, Text, Paragraph } = Typography;

export default function Dashboard() {
  const { data: statsData = [], isLoading: statsLoading, isError: statsError } = useDashboardStats();
  const { data: notifications = [], isLoading: notificationsLoading } = useNotifications();

  const stats = statsData[0] || {};

  const statsCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents || 0,
      icon: <TeamOutlined style={{ fontSize: 28, color: '#1677ff' }} />,
      bg: '#e6f4ff',
      growth: 12,
    },
    {
      title: 'Total Teachers',
      value: stats.totalTeachers || 0,
      icon: <UserOutlined style={{ fontSize: 28, color: '#52c41a' }} />,
      bg: '#f6ffed',
      growth: 5,
    },
    {
      title: 'Active Courses',
      value: stats.totalCourses || 0,
      icon: <BookOutlined style={{ fontSize: 28, color: '#722ed1' }} />,
      bg: '#f9f0ff',
      growth: 8,
    },
    {
      title: 'Total Fees Collected',
      value: stats.totalFeesCollected || 0,
      icon: <DollarOutlined style={{ fontSize: 28, color: '#fa8c16' }} />,
      bg: '#fff7e6',
      growth: 15,
      prefix: '₹',
    },
  ];

  const getNotificationTag = (type) => {
    const tagColors = { Important: 'red', Academic: 'blue', General: 'green' };
    return <Tag color={tagColors[type] || 'default'}>{type}</Tag>;
  };

  const getUnreadCount = () => notifications.filter(n => !n.read).length;

  return (
    <div>
      <Title level={3}>Dashboard</Title>
      <Text type="secondary" style={{ marginBottom: 24, display: 'block' }}>
        Welcome back! Here's an overview of your institute.
      </Text>

      {statsLoading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : statsError ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Paragraph type="danger">Error loading dashboard stats</Paragraph>
          <Button icon={<ReloadOutlined />} onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {statsCards.map((stat) => (
            <Col xs={24} sm={12} lg={6} key={stat.title}>
              <Card hoverable>
                <Space align="start" style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    prefix={stat.prefix}
                    formatter={(value) => typeof value === 'number' ? value.toLocaleString() : value}
                  />
                  <div style={{ width: 56, height: 56, borderRadius: 12, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {stat.icon}
                  </div>
                </Space>
                <div style={{ marginTop: 12 }}>
                  <Text type="success" style={{ fontSize: 13 }}>
                    <ArrowUpOutlined /> {stat.growth}%
                  </Text>
                  <Text type="secondary" style={{ fontSize: 13, marginLeft: 8 }}>
                    vs last month
                  </Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Pending Fees Overview" extra={<Tag color="orange">₹{(stats.pendingFees || 0).toLocaleString()}</Tag>}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="Active Students" value={stats.activeStudents || 0} valueStyle={{ color: '#52c41a' }} />
              </Col>
              <Col span={12}>
                <Statistic title="Inactive Students" value={stats.inactiveStudents || 0} valueStyle={{ color: '#ff4d4f' }} />
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title={<Space><BellOutlined />Notifications<Badge count={getUnreadCount()} /></Space>} style={{ height: '100%' }}>
            {notificationsLoading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}><Spin size="small" /></div>
            ) : (
              <List size="small" dataSource={notifications.slice(0, 5)} renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<Space><Text strong={!item.read}>{item.title}</Text>{!item.read && <Badge status="processing" />}</Space>}
                    description={<Space direction="vertical" size={0}><Text type="secondary" style={{ fontSize: 12 }}>{item.message}</Text><Space>{getNotificationTag(item.type)}<Text type="secondary" style={{ fontSize: 11 }}>{item.date}</Text></Space></Space>}
                  />
                </List.Item>
              )} />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
