import { useState } from 'react';
import { Typography, Button, message, Spin } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import StudentTable from './StudentTable';
import StudentForm from './StudentForm';
import { useStudents, useDeleteStudent } from '../../hooks/useStudents';
import { useCourses } from '../../hooks/useCourses';

const { Title, Paragraph } = Typography;

export default function Students() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  
  // Fetch students using React Query
  const { data: students = [], isLoading, isError, error } = useStudents();
  
  // Fetch courses for dropdown
  const { data: courses = [] } = useCourses();
  
  // Delete mutation
  const deleteMutation = useDeleteStudent();

  const handleAdd = (values) => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        message.success('Student deleted successfully');
      },
      onError: () => {
        message.error('Failed to delete student');
      },
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  // Transform students data to match table format
  const transformedStudents = students.map((student) => ({
    ...student,
    key: student.id,
    name: `${student.firstName} ${student.lastName}`,
    course: courses.find((c) => c.id === student.courseId)?.name || 'N/A',
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
            Students
          </Title>
          <Paragraph type="secondary" style={{ margin: 0 }}>
            Manage all student records, enrollments, and attendance here.
          </Paragraph>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Student
        </Button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : isError ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Paragraph type="danger">Error loading students: {error.message}</Paragraph>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      ) : (
        <StudentTable 
          students={transformedStudents} 
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={deleteMutation.isPending}
        />
      )}

      <StudentForm
        open={isModalOpen}
        onCancel={handleCancel}
        onSubmit={handleAdd}
        editingStudent={editingStudent}
        courses={courses}
      />
    </div>
  );
}
