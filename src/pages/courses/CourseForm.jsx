import { Modal, Form, Input, Select, InputNumber, message } from 'antd';
import { useCreateCourse, useUpdateCourse } from '../../hooks/useCourses';

export default function CourseForm({ open, onCancel, onSubmit, editingCourse, teachers = [] }) {
  const [form] = Form.useForm();
  
  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();

  const isEditing = !!editingCourse;

  // Reset form when modal opens/closes or editing course changes
  const handleOpenChange = (isOpen) => {
    if (isOpen && editingCourse) {
      form.setFieldsValue({
        ...editingCourse,
        duration: editingCourse.duration,
      });
    } else if (!isOpen) {
      form.resetFields();
    }
  };

  const handleOk = () => {
    form.submit();
  };

  const handleFinish = (values) => {
    const courseData = {
      ...values,
      teacherId: values.teacherId || null,
    };

    if (isEditing) {
      updateMutation.mutate(
        { id: editingCourse.id, data: courseData },
        {
          onSuccess: () => {
            message.success('Course updated successfully');
            form.resetFields();
            onSubmit();
          },
          onError: () => {
            message.error('Failed to update course');
          },
        }
      );
    } else {
      createMutation.mutate(courseData, {
        onSuccess: () => {
          message.success('Course added successfully');
          form.resetFields();
          onSubmit();
        },
        onError: () => {
          message.error('Failed to add course');
        },
      });
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      title={isEditing ? 'Edit Course' : 'Add New Course'}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText={isEditing ? 'Update' : 'Add Course'}
      confirmLoading={isPending}
      destroyOnClose
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        onOpenChange={handleOpenChange}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="name"
          label="Course Name"
          rules={[
            { required: true, message: 'Please enter the course name' },
          ]}
        >
          <Input placeholder="e.g. Computer Science Engineering" />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item
            name="code"
            label="Course Code"
            rules={[
              { required: true, message: 'Please enter the course code' },
            ]}
          >
            <Input placeholder="e.g. CSE" />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Duration (months)"
            rules={[{ required: true, message: 'Please enter duration' }]}
          >
            <InputNumber 
              placeholder="e.g. 48" 
              style={{ width: '100%' }} 
              min={1}
              max={120}
            />
          </Form.Item>
        </div>

        <Form.Item
          name="totalFees"
          label="Total Fees"
        >
          <InputNumber 
            placeholder="e.g. 250000" 
            style={{ width: '100%' }}
            min={0}
            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea placeholder="Enter course description" rows={3} />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item
            name="teacherId"
            label="Instructor"
          >
            <Select placeholder="Select instructor" allowClear>
              {teachers.map((teacher) => (
                <Select.Option key={teacher.id} value={teacher.id}>
                  {teacher.firstName} {teacher.lastName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select placeholder="Select status">
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="seats"
          label="Available Seats"
        >
          <InputNumber 
            placeholder="e.g. 60" 
            style={{ width: '100%' }}
            min={1}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
