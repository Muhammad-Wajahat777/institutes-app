import { Modal, Form, Input, Select, DatePicker, message } from 'antd';
import { useCreateStudent, useUpdateStudent } from '../../hooks/useStudents';
import dayjs from 'dayjs';

export default function StudentForm({ open, onCancel, onSubmit, editingStudent, courses = [] }) {
  const [form] = Form.useForm();
  
  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent();

  const isEditing = !!editingStudent;

  // Reset form when modal opens/closes or editing student changes
  const handleOpenChange = (isOpen) => {
    if (isOpen && editingStudent) {
      form.setFieldsValue({
        ...editingStudent,
        admissionDate: editingStudent.admissionDate ? dayjs(editingStudent.admissionDate) : null,
        dateOfBirth: editingStudent.dateOfBirth ? dayjs(editingStudent.dateOfBirth) : null,
      });
    } else if (!isOpen) {
      form.resetFields();
    }
  };

  const handleOk = () => {
    form.submit();
  };

  const handleFinish = (values) => {
    const studentData = {
      ...values,
      admissionDate: values.admissionDate ? values.admissionDate.format('YYYY-MM-DD') : null,
      dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
    };

    if (isEditing) {
      updateMutation.mutate(
        { id: editingStudent.id, data: studentData },
        {
          onSuccess: () => {
            message.success('Student updated successfully');
            form.resetFields();
            onSubmit();
          },
          onError: () => {
            message.error('Failed to update student');
          },
        }
      );
    } else {
      createMutation.mutate(studentData, {
        onSuccess: () => {
          message.success('Student added successfully');
          form.resetFields();
          onSubmit();
        },
        onError: () => {
          message.error('Failed to add student');
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
      title={isEditing ? 'Edit Student' : 'Add New Student'}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText={isEditing ? 'Update' : 'Add Student'}
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[
              { required: true, message: 'Please enter the first name' },
            ]}
          >
            <Input placeholder="e.g. Ali" />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[
              { required: true, message: 'Please enter the last name' },
            ]}
          >
            <Input placeholder="e.g. Ahmed" />
          </Form.Item>
        </div>

        <Form.Item
          name="rollNo"
          label="Roll Number"
          rules={[
            { required: true, message: 'Please enter the roll number' },
          ]}
        >
          <Input placeholder="e.g. STU001" />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter an email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="e.g. ali@email.com" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: 'Please enter a phone number' },
            ]}
          >
            <Input placeholder="e.g. 0301-1234567" />
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item
            name="courseId"
            label="Course"
            rules={[{ required: true, message: 'Please select a course' }]}
          >
            <Select placeholder="Select a course">
              {courses.map((course) => (
                <Select.Option key={course.id} value={course.id}>
                  {course.name}
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item
            name="admissionDate"
            label="Admission Date"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="dateOfBirth"
            label="Date of Birth"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </div>

        <Form.Item
          name="gender"
          label="Gender"
        >
          <Select placeholder="Select gender">
            <Select.Option value="Male">Male</Select.Option>
            <Select.Option value="Female">Female</Select.Option>
            <Select.Option value="Other">Other</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="address"
          label="Address"
        >
          <Input.TextArea placeholder="Enter address" rows={2} />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item
            name="fatherName"
            label="Father's Name"
          >
            <Input placeholder="Father's name" />
          </Form.Item>

          <Form.Item
            name="motherName"
            label="Mother's Name"
          >
            <Input placeholder="Mother's name" />
          </Form.Item>
        </div>

        <Form.Item
          name="emergencyContact"
          label="Emergency Contact"
        >
          <Input placeholder="Emergency contact number" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
