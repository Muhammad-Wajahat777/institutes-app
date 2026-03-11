import { useState } from 'react';
import {
  Form,
  Switch,
  Select,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Space,
  message,
} from 'antd';
import {
  MailOutlined,
  MessageOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  BellOutlined,
  SaveOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const notificationOptions = [
  {
    key: 'emailNotifications',
    icon: <MailOutlined style={{ fontSize: 20, color: '#1890ff' }} />,
    title: 'Email Notifications',
    description: 'Receive important updates and announcements via email',
    defaultValue: true,
  },
  {
    key: 'smsAlerts',
    icon: <MessageOutlined style={{ fontSize: 20, color: '#52c41a' }} />,
    title: 'SMS Alerts',
    description: 'Get SMS alerts for urgent notifications and reminders',
    defaultValue: true,
  },
  {
    key: 'feeReminders',
    icon: <DollarOutlined style={{ fontSize: 20, color: '#faad14' }} />,
    title: 'Fee Payment Reminders',
    description:
      'Send automatic reminders to students with pending fee payments',
    defaultValue: true,
  },
  {
    key: 'attendanceAlerts',
    icon: <CheckCircleOutlined style={{ fontSize: 20, color: '#722ed1' }} />,
    title: 'Attendance Alerts',
    description:
      'Notify parents when students are marked absent or have low attendance',
    defaultValue: false,
  },
  {
    key: 'examNotifications',
    icon: <FileTextOutlined style={{ fontSize: 20, color: '#eb2f96' }} />,
    title: 'Exam Notifications',
    description:
      'Send reminders about upcoming exams, results, and report cards',
    defaultValue: true,
  },
];

export default function NotificationPreferences() {
  const initialPrefs = {};
  notificationOptions.forEach((opt) => {
    initialPrefs[opt.key] = opt.defaultValue;
  });
  initialPrefs.reminderFrequency = 'Weekly';

  const [preferences, setPreferences] = useState(initialPrefs);
  const [loading, setLoading] = useState(false);

  const handleToggle = (key, checked) => {
    setPreferences((prev) => ({ ...prev, [key]: checked }));
  };

  const handleFrequencyChange = (value) => {
    setPreferences((prev) => ({ ...prev, reminderFrequency: value }));
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('Notification preferences saved successfully!');
    }, 600);
  };

  const enabledCount = notificationOptions.filter(
    (opt) => preferences[opt.key]
  ).length;

  return (
    <div>
      <Card
        style={{
          marginBottom: 24,
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          border: 'none',
        }}
      >
        <Row align="middle" gutter={16}>
          <Col>
            <BellOutlined
              style={{ fontSize: 40, color: 'rgba(255,255,255,0.9)' }}
            />
          </Col>
          <Col flex="auto">
            <Text
              strong
              style={{ color: '#fff', fontSize: 18, display: 'block' }}
            >
              Notification Center
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
              {enabledCount} of {notificationOptions.length} notification
              channels enabled
            </Text>
          </Col>
        </Row>
      </Card>

      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {notificationOptions.map((opt) => (
          <Card
            key={opt.key}
            size="small"
            style={{
              borderLeft: preferences[opt.key]
                ? '3px solid #1890ff'
                : '3px solid #d9d9d9',
              transition: 'all 0.3s ease',
            }}
          >
            <Row align="middle" gutter={16}>
              <Col>{opt.icon}</Col>
              <Col flex="auto">
                <Text strong style={{ display: 'block' }}>
                  {opt.title}
                </Text>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {opt.description}
                </Text>
              </Col>
              <Col>
                <Switch
                  checked={preferences[opt.key]}
                  onChange={(checked) => handleToggle(opt.key, checked)}
                />
              </Col>
            </Row>
          </Card>
        ))}
      </Space>

      <Divider />

      <Card>
        <Row align="middle" gutter={16}>
          <Col>
            <ClockCircleOutlined
              style={{ fontSize: 20, color: '#1890ff' }}
            />
          </Col>
          <Col flex="auto">
            <div>
              <Text strong style={{ display: 'block' }}>
                Reminder Frequency
              </Text>
              <Text type="secondary" style={{ fontSize: 13 }}>
                How often should automated reminders be sent?
              </Text>
            </div>
          </Col>
          <Col>
            <Select
              value={preferences.reminderFrequency}
              onChange={handleFrequencyChange}
              style={{ width: 150 }}
              options={[
                { label: 'Daily', value: 'Daily' },
                { label: 'Weekly', value: 'Weekly' },
                { label: 'Monthly', value: 'Monthly' },
              ]}
            />
          </Col>
        </Row>
      </Card>

      <div style={{ textAlign: 'right', marginTop: 24 }}>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={loading}
          onClick={handleSave}
          size="large"
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
