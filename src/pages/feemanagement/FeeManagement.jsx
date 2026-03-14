import { useState } from 'react';
import { Typography, Button, message, Spin } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import FeeTable from './FeeTable';
import FeeEntryForm from './FeeEntryForm';
import FeeReceipt from './FeeReceipt';
import { useFees, useDeleteFee } from '../../hooks/useFees';
import { useStudents } from '../../hooks/useStudents';
import { useCourses } from '../../hooks/useCourses';

const { Title, Paragraph } = Typography;

export default function FeeManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [receiptFee, setReceiptFee] = useState(null);
  
  // Fetch fees using React Query
  const { data: fees = [], isLoading, isError, error } = useFees();
  
  // Fetch students for dropdown
  const { data: students = [] } = useStudents();
  const { data: courses = [] } = useCourses();
  
  // Delete mutation
  const deleteMutation = useDeleteFee();

  const handleAdd = () => {
    setIsModalOpen(false);
    setEditingFee(null);
  };

  const handleEdit = (fee) => {
    setEditingFee(fee);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        message.success('Fee record deleted successfully');
      },
      onError: () => {
        message.error('Failed to delete fee record');
      },
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingFee(null);
  };

  const handlePrintReceipt = (fee) => {
    setReceiptFee(fee);
  };

  // Transform fees data to match table format
  const transformedFees = fees.map((fee) => ({
    ...fee,
    key: fee.id,
    studentName: fee.student ? `${fee.student.firstName} ${fee.student.lastName}` : 'N/A',
    studentId: fee.studentId,
    courseName:
      courses.find((course) => course.id === fee.courseId)?.name ||
      courses.find((course) => course.id === fee.student?.courseId)?.name ||
      'N/A',
  }));

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Fee Management
          </Title>
          <Paragraph type="secondary" style={{ margin: 0 }}>
            Track fee collections, pending payments, and generate invoices.
          </Paragraph>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Fee
        </Button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : isError ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Paragraph type="danger">Error loading fees: {error.message}</Paragraph>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      ) : (
        <FeeTable 
          feeRecords={transformedFees} 
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPrintReceipt={handlePrintReceipt}
          isDeleting={deleteMutation.isPending}
        />
      )}

      <FeeEntryForm
        open={isModalOpen}
        onCancel={handleCancel}
        onSubmit={handleAdd}
        editingFee={editingFee}
        students={students}
        courses={courses}
      />

      <FeeReceipt
        open={!!receiptFee}
        onClose={() => setReceiptFee(null)}
        fee={receiptFee}
      />
    </div>
  );
}
