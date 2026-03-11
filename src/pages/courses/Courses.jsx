import { useState } from 'react';
import { Typography, Button, message, Spin } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import CourseTable from './CourseTable';
import CourseForm from './CourseForm';
import { useCourses, useDeleteCourse } from '../../hooks/useCourses';
import { useTeachers } from '../../hooks/useTeachers';

const { Title, Paragraph } = Typography;

export default function Courses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  
  // Fetch courses using React Query
  const { data: courses = [], isLoading, isError, error } = useCourses();
  
  // Fetch teachers for dropdown
  const { data: teachers = [] } = useTeachers();
  
  // Delete mutation
  const deleteMutation = useDeleteCourse();

  const handleAdd = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        message.success('Course deleted successfully');
      },
      onError: () => {
        message.error('Failed to delete course');
      },
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  // Transform courses data to match table format
  const transformedCourses = courses.map((course) => {
    const teacher = teachers.find((t) => t.id === course.teacherId);

    return {
      ...course,
      key: course.id,
      instructor: teacher
        ? `${teacher.firstName} ${teacher.lastName}`
        : 'Not Assigned',
      duration: `${course.duration} months`,
    };
  });

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
            Courses
          </Title>
          <Paragraph type="secondary" style={{ margin: 0 }}>
            Browse and manage all courses, syllabi, and class schedules.
          </Paragraph>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Course
        </Button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : isError ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Paragraph type="danger">Error loading courses: {error.message}</Paragraph>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      ) : (
        <CourseTable 
          courses={transformedCourses} 
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={deleteMutation.isPending}
        />
      )}

      <CourseForm
        open={isModalOpen}
        onCancel={handleCancel}
        onSubmit={handleAdd}
        editingCourse={editingCourse}
        teachers={teachers}
      />
    </div>
  );
}
