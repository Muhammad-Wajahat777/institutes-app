import { useEffect, useMemo } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, message } from "antd";
import { useCreateFee, useUpdateFee } from "../../hooks/useFees";
import dayjs from 'dayjs';

export default function FeeEntryForm({ open, onCancel, onSubmit, editingFee, students = [], courses = [] }) {
  const [form] = Form.useForm();
  
  const createMutation = useCreateFee();
  const updateMutation = useUpdateFee();

  const isEditing = !!editingFee;
  const selectedStudentId = Form.useWatch('studentId', form);
  const amountPaid = Number(Form.useWatch('amountPaid', form) || 0);

  const selectedStudent = useMemo(
    () => students.find((student) => student.id === selectedStudentId),
    [students, selectedStudentId]
  );

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === selectedStudent?.courseId),
    [courses, selectedStudent]
  );

  const totalFee = Number(selectedCourse?.totalFees || 0);
  const calculatedAmountDue = Math.max(totalFee - amountPaid, 0);

  useEffect(() => {
    if (!open) {
      form.resetFields();
      return;
    }

    if (editingFee) {
      form.setFieldsValue({
        ...editingFee,
        paymentDate: editingFee.paymentDate ? dayjs(editingFee.paymentDate) : null,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        receiptNo: 'Auto-generated on save',
      });
    }
  }, [open, editingFee, form]);

  useEffect(() => {
    if (!open) return;

    form.setFieldsValue({
      courseName: selectedCourse?.name || '—',
      totalFee,
      amountDue: calculatedAmountDue,
    });
  }, [open, selectedCourse, totalFee, calculatedAmountDue, form]);

  const handleOk = () => {
    form.submit();
  };

  const handleFinish = (values) => {
    const commonData = {
      studentId: values.studentId,
      paymentDate: values.paymentDate ? values.paymentDate.format('YYYY-MM-DD') : null,
      amountPaid: values.amountPaid || 0,
      paymentType: values.paymentType,
      status: values.status,
      installment: values.installment || '1st Year - 1st Semester',
    };

    if (isEditing) {
      const updateData = {
        ...commonData,
        // Keep these in sync for edits when row already exists.
        amountDue: values.amountDue || calculatedAmountDue,
      };

      updateMutation.mutate(
        { id: editingFee.id, data: updateData },
        {
          onSuccess: () => {
            message.success('Fee record updated successfully');
            form.resetFields();
            onSubmit();
          },
          onError: () => {
            message.error('Failed to update fee record');
          },
        }
      );
    } else {
      // courseId, totalFee, amountDue, and receiptNo are DB-managed during insert.
      createMutation.mutate(commonData, {
        onSuccess: () => {
          message.success('Fee record added successfully');
          form.resetFields();
          onSubmit();
        },
        onError: () => {
          message.error('Failed to add fee record');
        },
      });
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  // Transform students for dropdown
  const studentOptions = students.map((student) => ({
    value: student.id,
    label: `${student.firstName} ${student.lastName} (${student.rollNo})`,
  }));

  const paymentMethods = [
    { value: "Cash", label: "Cash" },
    { value: "Online", label: "Online" },
    { value: "Bank Transfer", label: "Bank Transfer" },
  ];

  const statusOptions = [
    { value: "Paid", label: "Paid" },
    { value: "Pending", label: "Pending" },
    { value: "Partial", label: "Partial" },
  ];

  return (
    <Modal
      title={isEditing ? 'Edit Fee Payment' : 'Add Fee Payment'}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText={isEditing ? 'Update' : 'Add Payment'}
      confirmLoading={isPending}
      destroyOnClose
      width={520}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="studentId"
          label="Student"
          rules={[{ required: true, message: "Please select a student" }]}
        >
          <Select
            placeholder="Select a student"
            showSearch
            options={studentOptions}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item name="courseName" label="Course">
            <Input disabled />
          </Form.Item>

          <Form.Item name="totalFee" label="Total Fee">
            <InputNumber
              prefix="₹"
              style={{ width: "100%" }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/,/g, "")}
              disabled
            />
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item
            name="amountPaid"
            label="Amount Paid"
            rules={[
              { required: true, message: "Please enter the amount paid" },
            ]}
          >
            <InputNumber
              placeholder="e.g. 62500"
              prefix="₹"
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/,/g, "")}
            />
          </Form.Item>

          <Form.Item
            name="amountDue"
            label="Amount Due"
          >
            <InputNumber
              prefix="₹"
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/,/g, "")}
              disabled
            />
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item
            name="paymentDate"
            label="Payment Date"
          >
            <DatePicker style={{ width: "100%" }} format="DD MMM YYYY" />
          </Form.Item>

          <Form.Item
            name="paymentType"
            label="Payment Method"
          >
            <Select
              placeholder="Select payment method"
              options={paymentMethods}
            />
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select
              placeholder="Select status"
              options={statusOptions}
            />
          </Form.Item>

          <Form.Item name="installment" label="Installment">
            <Input placeholder="e.g. 1st Year - 1st Semester" />
          </Form.Item>
        </div>

        <Form.Item
          name="receiptNo"
          label="Receipt Number"
        >
          <Input placeholder="Auto-generated by DB (RCP-0001...)" disabled />
        </Form.Item>

      </Form>
    </Modal>
  );
}
