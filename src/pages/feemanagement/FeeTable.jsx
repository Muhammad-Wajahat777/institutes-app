import { Table, Button, Tag, Popconfirm, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

export default function FeeTable({ feeRecords, onEdit, onDelete, isDeleting }) {
  const columns = [
    {
      title: 'Receipt No',
      dataIndex: 'receiptNo',
      key: 'receiptNo',
    },
    {
      title: 'Student Name',
      dataIndex: 'studentName',
      key: 'studentName',
    },
    {
      title: 'Amount Paid',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `₹${Number(amount || 0).toLocaleString()}`,
    },
    {
      title: 'Amount Due',
      dataIndex: 'amountDue',
      key: 'amountDue',
      render: (amountDue) => `₹${Number(amountDue || 0).toLocaleString()}`,
    },
    {
      title: 'Payment Date',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      render: (date) => date || '—',
    },
    {
      title: 'Payment Type',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method) => {
        const colorMap = {
          Cash: 'green',
          Online: 'purple',
          'Bank Transfer': 'blue',
        };
        return <Tag color={colorMap[method] || 'default'}>{method || '—'}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colorMap = {
          Paid: 'green',
          Pending: 'orange',
          Partial: 'blue',
        };
        return <Tag color={colorMap[status] || 'default'}>{status || '—'}</Tag>;
      },
    },
    {
      title: 'Academic Year',
      dataIndex: 'academicYear',
      key: 'academicYear',
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
            title="Are you sure you want to delete this fee record?"
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
      dataSource={feeRecords}
      pagination={{ pageSize: 10 }}
      bordered
    />
  );
}
