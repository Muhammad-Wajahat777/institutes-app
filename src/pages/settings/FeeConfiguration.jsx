import { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Tag,
  Space,
  Popconfirm,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  message,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  DollarOutlined,
  TagOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

const initialCategories = [
  {
    key: 1,
    name: 'Tuition Fee',
    amount: 15000,
    frequency: 'Monthly',
    type: 'Mandatory',
  },
  {
    key: 2,
    name: 'Lab Fee',
    amount: 5000,
    frequency: 'Per Semester',
    type: 'Mandatory',
  },
  {
    key: 3,
    name: 'Library Fee',
    amount: 2000,
    frequency: 'Annually',
    type: 'Mandatory',
  },
  {
    key: 4,
    name: 'Transport Fee',
    amount: 8000,
    frequency: 'Monthly',
    type: 'Optional',
  },
  {
    key: 5,
    name: 'Sports Fee',
    amount: 3000,
    frequency: 'Per Semester',
    type: 'Optional',
  },
  {
    key: 6,
    name: 'Exam Fee',
    amount: 4000,
    frequency: 'Per Semester',
    type: 'Mandatory',
  },
];

export default function FeeConfiguration() {
  const [categories, setCategories] = useState(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleAdd = () => {
    form.validateFields().then((values) => {
      const newCat = {
        key: Date.now(),
        ...values,
      };
      setCategories((prev) => [...prev, newCat]);
      form.resetFields();
      setIsModalOpen(false);
      message.success('Fee category added successfully!');
    });
  };

  const handleDelete = (key) => {
    setCategories((prev) => prev.filter((c) => c.key !== key));
    message.success('Fee category removed.');
  };

  const totalMonthly = categories
    .filter((c) => c.frequency === 'Monthly')
    .reduce((sum, c) => sum + c.amount, 0);

  const totalMandatory = categories
    .filter((c) => c.type === 'Mandatory')
    .reduce((sum, c) => sum + c.amount, 0);

  const columns = [
    {
      title: 'Category',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <TagOutlined style={{ color: '#667eea' }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Amount (PKR)',
      dataIndex: 'amount',
      key: 'amount',
      render: (val) => (
        <Text strong style={{ color: '#52c41a' }}>
          Rs. {val.toLocaleString()}
        </Text>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      key: 'frequency',
      render: (freq) => <Tag color="blue">{freq}</Tag>,
      filters: [
        { text: 'Monthly', value: 'Monthly' },
        { text: 'Per Semester', value: 'Per Semester' },
        { text: 'Annually', value: 'Annually' },
        { text: 'One-Time', value: 'One-Time' },
      ],
      onFilter: (value, record) => record.frequency === value,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'Mandatory' ? 'red' : 'green'}>{type}</Tag>
      ),
      filters: [
        { text: 'Mandatory', value: 'Mandatory' },
        { text: 'Optional', value: 'Optional' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="Delete this fee category?"
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
              title="Total Categories"
              value={categories.length}
              prefix={<TagOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Monthly Fee Total"
              value={totalMonthly}
              prefix={<DollarOutlined />}
              suffix="PKR"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Mandatory Fee Total"
              value={totalMandatory}
              prefix={<DollarOutlined />}
              suffix="PKR"
              valueStyle={{ color: '#cf1322' }}
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
          Add Fee Category
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        pagination={false}
        bordered
        size="middle"
      />

      <Modal
        title="Add Fee Category"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onOk={handleAdd}
        okText="Add Category"
      >
        <Form form={form} layout="vertical" requiredMark="optional">
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: 'Please enter category name' }]}
          >
            <Input placeholder="e.g. Admission Fee" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="amount"
                label="Amount (PKR)"
                rules={[{ required: true, message: 'Enter amount' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="e.g. 5000"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value.replace(/,/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="frequency"
                label="Frequency"
                rules={[{ required: true, message: 'Select frequency' }]}
              >
                <Select
                  placeholder="Select frequency"
                  options={[
                    { label: 'Monthly', value: 'Monthly' },
                    { label: 'Per Semester', value: 'Per Semester' },
                    { label: 'Annually', value: 'Annually' },
                    { label: 'One-Time', value: 'One-Time' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: 'Select type' }]}
          >
            <Select
              placeholder="Mandatory or Optional"
              options={[
                { label: 'Mandatory', value: 'Mandatory' },
                { label: 'Optional', value: 'Optional' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
