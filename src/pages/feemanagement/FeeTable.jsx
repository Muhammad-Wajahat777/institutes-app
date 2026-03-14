import { Table, Button, Tag, Popconfirm, Space } from 'antd';
import { EditOutlined, DeleteOutlined, PrinterOutlined } from '@ant-design/icons';

export default function FeeTable({ feeRecords, onEdit, onDelete, onPrintReceipt, isDeleting }) {
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
      title: 'Course',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: 'Total Fee',
      dataIndex: 'totalFee',
      key: 'totalFee',
      render: (totalFee) => `₹${Number(totalFee || 0).toLocaleString()}`,
    },
    {
      title: 'Amount Paid',
      dataIndex: 'amountPaid',
      key: 'amountPaid',
      render: (amountPaid) => `₹${Number(amountPaid || 0).toLocaleString()}`,
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
      dataIndex: 'paymentType',
      key: 'paymentType',
      render: (paymentType) => {
        const colorMap = {
          Cash: 'green',
          Online: 'purple',
          'Bank Transfer': 'blue',
        };
        return <Tag color={colorMap[paymentType] || 'default'}>{paymentType || '—'}</Tag>;
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
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<PrinterOutlined />}
            onClick={() => onPrintReceipt(record)}
          >
            Receipt
          </Button>
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
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <Table
        columns={columns}
        dataSource={feeRecords}
        pagination={{ pageSize: 10 }}
        bordered
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
}
