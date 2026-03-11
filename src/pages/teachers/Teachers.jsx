import { useState } from 'react';
import { Typography, Button, message, Spin } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import TeacherTable from './TeacherTable';
import TeacherForm from './TeacherForm';
import { useTeachers, useDeleteTeacher } from '../../hooks/useTeachers';

const { Title, Paragraph } = Typography;

export default function Teachers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  
  // Fetch teachers using React Query
  const { data: teachers = [], isLoading, isError, error } = useTeachers();
  
  // Delete mutation
  const deleteMutation = useDeleteTeacher();

  const handleAdd = () => {
    setIsModalOpen(false);
    setEditingTeacher(null);
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        message.success('Teacher deleted successfully');
      },
      onError: () => {
        message.error('Failed to delete teacher');
      },
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingTeacher(null);
  };

  // Transform teachers data to match table format
  const transformedTeachers = teachers.map((teacher) => ({
    ...teacher,
    key: teacher.id,
    name: `${teacher.firstName} ${teacher.lastName}`,
    subject: teacher.subjectSpecialization,
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
            Teachers
          </Title>
          <Paragraph type="secondary" style={{ margin: 0 }}>
            Manage teacher profiles, schedules, and assignments here.
          </Paragraph>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Teacher
        </Button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : isError ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Paragraph type="danger">Error loading teachers: {error.message}</Paragraph>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      ) : (
        <TeacherTable 
          teachers={transformedTeachers} 
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={deleteMutation.isPending}
        />
      )}

      <TeacherForm
        open={isModalOpen}
        onCancel={handleCancel}
        onSubmit={handleAdd}
        editingTeacher={editingTeacher}
      />
    </div>
  );
}
