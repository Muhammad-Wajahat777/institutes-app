import { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Tag,
  Space,
  Popconfirm,
  Typography,
  Card,
  Statistic,
  Row,
  Col,
  message,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

const initialYears = [
  {
    key: 1,
    name: '2025–2026',
    startDate: '2025-04-01',
    endDate: '2026-03-31',
    status: 'Active',
  },
  {
    key: 2,
    name: '2024–2025',
    startDate: '2024-04-01',
    endDate: '2025-03-31',
    status: 'Closed',
  },
  {
    key: 3,
    name: '2023–2024',
    startDate: '2023-04-01',
    endDate: '2024-03-31',
    status: 'Closed',
  },
];

export default function AcademicYearSettings() {
  const [years, setYears] = useState(initialYears);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleAdd = () => {
    form.validateFields().then((values) => {
      const newYear = {
        key: Date.now(),
        name: values.name,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
        status: values.status,
      };
      setYears((prev) => [newYear, ...prev]);
      form.resetFields();
      setIsModalOpen(false);
      message.success('Academic year added successfully!');
    });
  };

  const handleDelete = (key) => {
    setYears((prev) => prev.filter((y) => y.key !== key));
    message.success('Academic year removed.');
  };

  const activeCount = years.filter((y) => y.status === 'Active').length;

  const columns = [
    {
      title: 'Academic Year',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <CalendarOutlined style={{ color: '#667eea' }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag
          icon={
            status === 'Active' ? (
              <CheckCircleOutlined />
            ) : (
              <ClockCircleOutlined />
            )
          }
          color={status === 'Active' ? 'success' : 'default'}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="Delete this academic year?"
          onConfirm={() => handleDelete(record.key)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="text" danger icon={<DeleteOutlined />} size="small">
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
              title="Total Academic Years"
              value={years.length}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Active"
              value={activeCount}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Closed"
              value={years.length - activeCount}
              valueStyle={{ color: '#999' }}
              prefix={<ClockCircleOutlined />}
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
          Add Academic Year
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={years}
        pagination={false}
        bordered
        size="middle"
      />

      <Modal
        title="Add Academic Year"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onOk={handleAdd}
        okText="Add Year"
      >
        <Form form={form} layout="vertical" requiredMark="optional">
          <Form.Item
            name="name"
            label="Academic Year Name"
            rules={[{ required: true, message: 'Please enter the year name' }]}
          >
            <Input placeholder="e.g. 2026–2027" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="Start Date"
                rules={[{ required: true, message: 'Select start date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="End Date"
                rules={[{ required: true, message: 'Select end date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Select status' }]}
          >
            <Select
              placeholder="Select status"
              options={[
                { label: 'Active', value: 'Active' },
                { label: 'Closed', value: 'Closed' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
