import { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Checkbox,
  Tag,
  Space,
  Popconfirm,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Avatar,
  message,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  UserOutlined,
  SafetyOutlined,
  TeamOutlined,
  CrownOutlined,
} from '@ant-design/icons';

const { Text } = Typography;
const { TextArea } = Input;

const allPermissions = [
  'Manage Students',
  'Manage Teachers',
  'Manage Courses',
  'Manage Fees',
  'View Reports',
  'Manage Settings',
  'Manage Users',
  'Send Notifications',
  'Export Data',
  'View Dashboard',
];

const roleColors = {
  Admin: '#f5222d',
  Teacher: '#1890ff',
  Accountant: '#52c41a',
  Receptionist: '#722ed1',
};

const roleIcons = {
  Admin: <CrownOutlined />,
  Teacher: <UserOutlined />,
  Accountant: <SafetyOutlined />,
  Receptionist: <TeamOutlined />,
};

const initialRoles = [
  {
    key: 1,
    name: 'Admin',
    description: 'Full system access with all permissions',
    permissions: [...allPermissions],
    users: 2,
  },
  {
    key: 2,
    name: 'Teacher',
    description: 'Access to student records, courses, and attendance',
    permissions: [
      'Manage Students',
      'Manage Courses',
      'View Reports',
      'View Dashboard',
    ],
    users: 12,
  },
  {
    key: 3,
    name: 'Accountant',
    description: 'Access to fee management, billing, and financial reports',
    permissions: [
      'Manage Fees',
      'View Reports',
      'Export Data',
      'View Dashboard',
    ],
    users: 3,
  },
  {
    key: 4,
    name: 'Receptionist',
    description: 'Access to student inquiries, registration, and basic records',
    permissions: ['Manage Students', 'Send Notifications', 'View Dashboard'],
    users: 2,
  },
];

export default function RolesPermissions() {
  const [roles, setRoles] = useState(initialRoles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleAdd = () => {
    form.validateFields().then((values) => {
      const newRole = {
        key: Date.now(),
        name: values.name,
        description: values.description || '',
        permissions: values.permissions || [],
        users: 0,
      };
      setRoles((prev) => [...prev, newRole]);
      form.resetFields();
      setIsModalOpen(false);
      message.success('Role created successfully!');
    });
  };

  const handleDelete = (key) => {
    setRoles((prev) => prev.filter((r) => r.key !== key));
    message.success('Role removed.');
  };

  const totalUsers = roles.reduce((sum, r) => sum + r.users, 0);

  const columns = [
    {
      title: 'Role',
      dataIndex: 'name',
      key: 'name',
      render: (name) => (
        <Space>
          <Avatar
            size="small"
            icon={roleIcons[name] || <UserOutlined />}
            style={{
              backgroundColor: roleColors[name] || '#1890ff',
            }}
          />
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text) => <Text type="secondary">{text}</Text>,
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      width: 300,
      render: (perms) => (
        <Space size={[0, 4]} wrap>
          {perms.slice(0, 3).map((p) => (
            <Tag key={p} color="blue" style={{ fontSize: 11 }}>
              {p}
            </Tag>
          ))}
          {perms.length > 3 && (
            <Tag color="default" style={{ fontSize: 11 }}>
              +{perms.length - 3} more
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Users',
      dataIndex: 'users',
      key: 'users',
      width: 80,
      align: 'center',
      render: (count) => (
        <Tag color="purple">
          {count} {count === 1 ? 'user' : 'users'}
        </Tag>
      ),
      sorter: (a, b) => a.users - b.users,
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Popconfirm
          title="Delete this role?"
          description="Users with this role will lose their permissions."
          onConfirm={() => handleDelete(record.key)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            size="small"
            disabled={record.name === 'Admin'}
          >
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Roles"
              value={roles.length}
              prefix={<SafetyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Users Assigned"
              value={totalUsers}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Available Permissions"
              value={allPermissions.length}
              prefix={<CrownOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: 16,
        }}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Role
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={roles}
        pagination={false}
        bordered
        size="middle"
      />

      <Modal
        title="Create New Role"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onOk={handleAdd}
        okText="Create Role"
        width={520}
      >
        <Form form={form} layout="vertical" requiredMark="optional">
          <Form.Item
            name="name"
            label="Role Name"
            rules={[{ required: true, message: 'Please enter role name' }]}
          >
            <Input placeholder="e.g. Librarian" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea
              rows={2}
              placeholder="Brief description of this role..."
              showCount
              maxLength={200}
            />
          </Form.Item>
          <Form.Item
            name="permissions"
            label="Permissions"
            rules={[
              { required: true, message: 'Select at least one permission' },
            ]}
          >
            <Checkbox.Group>
              <Row gutter={[0, 8]}>
                {allPermissions.map((perm) => (
                  <Col span={12} key={perm}>
                    <Checkbox value={perm}>{perm}</Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
