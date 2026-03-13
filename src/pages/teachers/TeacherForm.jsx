import { useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { useCreateTeacher, useUpdateTeacher } from '../../hooks/useTeachers';

export default function TeacherForm({ open, onCancel, onSubmit, editingTeacher }) {
  const [form] = Form.useForm();
  
  const createMutation = useCreateTeacher();
  const updateMutation = useUpdateTeacher();

  const isEditing = !!editingTeacher;

  useEffect(() => {
    if (!open) {
      form.resetFields();
      return;
    }

    if (editingTeacher) {
      form.setFieldsValue({
        ...editingTeacher,
        subject: editingTeacher.subject || editingTeacher.subjectSpecialization,
      });
    } else {
      form.resetFields();
    }
  }, [open, editingTeacher, form]);

  const handleOk = () => {
    form.submit();
  };

  const handleFinish = (values) => {
    const teacherData = {
      ...values,
      subjectSpecialization: values.subject,
    };

    if (isEditing) {
      updateMutation.mutate(
        { id: editingTeacher.id, data: teacherData },
        {
          onSuccess: () => {
            message.success('Teacher updated successfully');
            form.resetFields();
            onSubmit();
          },
          onError: (error) => {
            message.error(error?.message || 'Failed to update teacher');
          },
        }
      );
    } else {
      createMutation.mutate(teacherData, {
        onSuccess: () => {
          message.success('Teacher added successfully');
          form.resetFields();
          onSubmit();
        },
        onError: (error) => {
          message.error(error?.message || 'Failed to add teacher');
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
      title={isEditing ? 'Edit Teacher' : 'Add New Teacher'}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText={isEditing ? 'Update' : 'Add Teacher'}
      confirmLoading={isPending}
      destroyOnClose
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
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
            <Input placeholder="e.g. Dr. Rajesh" />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[
              { required: true, message: 'Please enter the last name' },
            ]}
          >
            <Input placeholder="e.g. Khanna" />
          </Form.Item>
        </div>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter an email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input placeholder="e.g. rajesh.khanna@institute.com" />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: 'Please enter a phone number' },
            ]}
          >
            <Input placeholder="e.g. 9988776655" />
          </Form.Item>

          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: 'Please enter a subject' }]}
          >
            <Input placeholder="e.g. Mathematics" />
          </Form.Item>
        </div>

        <Form.Item
          name="qualification"
          label="Qualification"
          rules={[{ required: true, message: 'Please enter qualification' }]}
        >
          <Input placeholder="e.g. M.Sc. Mathematics, M.Phil" />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item
            name="salary"
            label="Salary"
          >
            <Input type="number" placeholder="e.g. 85000" />
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
          name="experience"
          label="Experience"
        >
          <Input placeholder="e.g. 8 years" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Address"
        >
          <Input.TextArea placeholder="Enter address" rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
