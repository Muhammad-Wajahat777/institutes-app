import { Table, Tag, Button, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

export default function CourseTable({ courses, onEdit, onDelete, isDeleting }) {
  const columns = [
    {
      title: 'Course Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Duration (months)',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => duration ?? 'N/A',
    },
    {
      title: 'Total Fees',
      dataIndex: 'totalFees',
      key: 'totalFees',
      render: (fees) => fees ? `$${fees.toLocaleString()}` : 'N/A',
    },
    {
      title: 'Instructor',
      dataIndex: 'instructor',
      key: 'instructor',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this course?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />}
              loading={isDeleting}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={courses}
      pagination={{ pageSize: 10 }}
      bordered
    />
  );
}
