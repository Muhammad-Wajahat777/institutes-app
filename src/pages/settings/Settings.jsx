import { Tabs, Typography } from 'antd';
import {
  BankOutlined,
  BellOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import InstituteProfile from './InstituteProfile';
import NotificationPreferences from './NotificationPreferences';
import RolesPermissions from './RolesPermissions';

const { Title, Paragraph } = Typography;

const tabItems = [
  {
    key: 'profile',
    label: 'Institute Profile',
    icon: <BankOutlined />,
    children: <InstituteProfile />,
  },
  {
    key: 'notifications',
    label: 'Notifications',
    icon: <BellOutlined />,
    children: <NotificationPreferences />,
  },
  {
    key: 'roles',
    label: 'Roles & Permissions',
    icon: <SafetyOutlined />,
    children: <RolesPermissions />,
  },
];

export default function Settings() {
  return (
    <div>
      <Title level={3}>Settings</Title>
      <Paragraph type="secondary" style={{ marginBottom: 24 }}>
        Configure institute profile, notifications, and user roles.
      </Paragraph>

      <Tabs
        defaultActiveKey="profile"
        items={tabItems.map((item) => ({
          ...item,
          label: (
            <span>
              {item.icon} {item.label}
            </span>
          ),
        }))}
        size="large"
        tabBarStyle={{ marginBottom: 24 }}
      />
    </div>
  );
}
